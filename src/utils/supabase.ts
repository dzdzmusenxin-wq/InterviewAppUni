import type {
  QuestionCategory,
  QuestionBankItem,
  User,
  StudyRecord,
  Favorite,
  AppComment,
  SearchHistory
} from '@/types';
import { SUPABASE_CONFIG } from '@/config/supabase';

// Supabase 配置
const SUPABASE_URL = SUPABASE_CONFIG.url;
const SUPABASE_KEY = SUPABASE_CONFIG.key;

/**
 * 使用 uni.request 发送请求到 Supabase REST API
 */
const request = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<{ data: T; error: any }> => {
  return new Promise((resolve) => {
    console.log(`[Supabase] 请求: ${method} ${SUPABASE_URL}/rest/v1${url}`);
    console.log(`[Supabase] 数据:`, data);
    console.log(`[Supabase] API Key:`, SUPABASE_KEY);
    
    // 设置超时时间（15秒）
    const timeout = setTimeout(() => {
      console.error('[Supabase] 请求超时');
      uni.showToast({ title: '请求超时，请稍后重试', icon: 'none', duration: 3000 });
      resolve({ data: null as any, error: { message: '请求超时', code: 'TIMEOUT' } });
    }, 15000);
    
    // 构建请求头
    const headers: any = {
      'Content-Type': 'application/json',
    };
    
    // 添加认证信息
    if (SUPABASE_KEY) {
      headers['apikey'] = SUPABASE_KEY;
      // 确保 Authorization header 格式正确（Bearer + 空格 + key）
      headers['Authorization'] = `Bearer ${SUPABASE_KEY}`;
    }
    
    uni.request({
      url: `${SUPABASE_URL}/rest/v1${url}`,
      method,
      data,
      header: headers,
      timeout: 15000, // 添加超时设置
      success: (res) => {
        clearTimeout(timeout); // 清除超时定时器
        console.log(`[Supabase] 响应状态: ${res.statusCode}`);
        console.log(`[Supabase] 响应数据:`, res.data);
        
        // 处理 Supabase REST API 错误
        if (res.statusCode === 401) {
          const errorData = res.data as any;
          let errorMessage = '认证失败，请检查配置';
          
          // 判断是否是 RLS 策略问题
          if (errorData && errorData.code === '42501') {
            errorMessage = '数据库权限不足，请在 Supabase 配置 RLS 策略';
          } else if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
          
          const error = { 
            message: errorMessage,
            statusCode: 401,
            data: res.data 
          };
          console.error('[Supabase] 认证错误:', error);
          uni.showToast({ title: errorMessage, icon: 'none', duration: 3000 });
          resolve({ data: null as any, error });
        } else if (res.statusCode >= 400) {
          const error = res.data || { message: `HTTP Error ${res.statusCode}` };
          console.error('[Supabase] 请求错误:', error);
          resolve({ data: null as any, error });
        } else {
          resolve({ data: res.data as T, error: null });
        }
      },
      fail: (err) => {
        clearTimeout(timeout); // 清除超时定时器
        console.error('[Supabase] 请求失败:', err);
        resolve({ data: null as any, error: err });
      }
    });
  });
};

// ============================================
// 从 questions 表读取数据
// ============================================

/**
 * 获取所有题目（从 questions 表）
 */
export const getAllQuestionsFromTable = async (): Promise<any[]> => {
  try {
    const { data, error } = await request('/questions?order=created_at.desc');
    if (error) {
      console.error('获取题目失败:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('getAllQuestionsFromTable 错误:', error);
    return [];
  }
};

/**
 * 按分类获取题目
 */
export const getQuestionsByCategory = async (category: string): Promise<any[]> => {
  try {
    const { data, error } = await request(`/questions?category=eq.${encodeURIComponent(category)}&order=created_at.desc`);
    if (error) {
      console.error('获取分类题目失败:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('getQuestionsByCategory 错误:', error);
    return [];
  }
};

/**
 * 获取推荐题目
 */
export const getRecommendedQuestions = async (): Promise<any[]> => {
  try {
    const { data, error } = await request('/questions?is_recommended=eq.true&order=created_at.desc');
    if (error) {
      console.error('获取推荐题目失败:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('getRecommendedQuestions 错误:', error);
    return [];
  }
};

/**
 * 获取所有分类（从 questions 表的 category 字段提取）
 */
export const getAllCategoriesFromQuestions = async (): Promise<{ id: string; name: string; icon: string; count: number }[]> => {
  try {
    const questions = await getAllQuestionsFromTable();
    
    // 统计每个分类的题目数量
    const categoryMap = new Map<string, number>();
    questions.forEach(q => {
      if (q.category) {
        const count = categoryMap.get(q.category) || 0;
        categoryMap.set(q.category, count + 1);
      }
    });
    
    // 分类名称和图标映射
    const categoryInfo: Record<string, { name: string; icon: string }> = {
      'JavaScript': { name: 'JavaScript', icon: '📦' },
      'TypeScript': { name: 'TypeScript', icon: '🔷' },
      'Vue.js': { name: 'Vue.js', icon: '💚' },
      'React': { name: 'React', icon: '⚛️' },
      'CSS/样式': { name: 'CSS/样式', icon: '🎨' },
      '性能优化': { name: '性能优化', icon: '⚡' },
      '架构设计': { name: '架构设计', icon: '🏗️' },
      '安全': { name: '安全', icon: '🔒' },
      '网络相关': { name: '网络相关', icon: '🌐' },
      '算法题': { name: '算法题', icon: '🧮' }
    };
    
    const result: { id: string; name: string; icon: string; count: number }[] = [];
    categoryMap.forEach((count, category) => {
      const info = categoryInfo[category] || { name: category, icon: '📚' };
      result.push({
        id: 'cat_' + category.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        name: info.name,
        icon: info.icon,
        count
      });
    });
    
    return result.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('getAllCategoriesFromQuestions 错误:', error);
    return [];
  }
};

/**
 * 获取单个题目
 */
export const getQuestionById = async (id: string): Promise<any | null> => {
  try {
    const { data, error } = await request(`/questions?id=eq.${encodeURIComponent(id)}`);
    if (error) {
      console.error('获取题目失败:', error);
      throw error;
    }
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('getQuestionById 错误:', error);
    return null;
  }
};

/**
 * 根据父问题ID获取追问列表
 */
export const getQuestionsByParentId = async (parentId: string): Promise<any[]> => {
  try {
    const { data, error } = await request(`/questions?parent_id=eq.${encodeURIComponent(parentId)}&order=created_at.asc`);
    if (error) {
      console.error('获取追问失败:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('getQuestionsByParentId 错误:', error);
    return [];
  }
};

// ============================================
// 分类相关操作（保留原有接口）
// ============================================

export const addCategory = async (category: QuestionCategory): Promise<void> => {
  console.warn('addCategory: 操作未实现');
};

export const addCategories = async (categories: QuestionCategory[]): Promise<void> => {
  console.warn('addCategories: 操作未实现');
};

export const getAllCategories = async (): Promise<QuestionCategory[]> => {
  try {
    const { data, error } = await request('/question_categories?enabled=eq.true&order=sort_order.asc');
    if (error) {
      console.error('获取分类失败:', error);
      throw error;
    }
    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      icon: row.icon,
      parentId: row.parent_id,
      sortOrder: row.sort_order,
      enabled: row.enabled
    }));
  } catch (error) {
    console.error('getAllCategories 错误:', error);
    return [];
  }
};

export const getCategoryById = async (id: string): Promise<QuestionCategory | null> => {
  try {
    const { data, error } = await request(`/question_categories?id=eq.${encodeURIComponent(id)}&enabled=eq.true`);
    if (error) {
      console.error('获取分类失败:', error);
      throw error;
    }
    const row = data && data.length > 0 ? data[0] : null;
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      icon: row.icon,
      parentId: row.parent_id,
      sortOrder: row.sort_order,
      enabled: row.enabled
    };
  } catch (error) {
    console.error('getCategoryById 错误:', error);
    return null;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  console.warn('deleteCategory: 操作未实现');
};

// ============================================
// 题目相关操作（保留原有接口）
// ============================================

export const addQuestion = async (question: QuestionBankItem): Promise<void> => {
  console.warn('addQuestion: 操作未实现');
};

/**
 * 添加问题到 questions 表
 */
export const insertQuestionToTable = async (question: any): Promise<any> => {
  try {
    const { data, error } = await request(
      '/questions',
      'POST',
      question
    );
    if (error) {
      console.error('添加问题失败:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('插入问题到表失败:', error);
    throw error;
  }
};

/**
 * 更新 questions 表中的问题
 */
export const updateQuestionInTable = async (id: string, question: any): Promise<any> => {
  try {
    const { data, error } = await request(
      `/questions?id=eq.${id}`,
      'PUT',
      question
    );
    if (error) {
      console.error('更新问题失败:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('更新问题到表失败:', error);
    throw error;
  }
};

/**
 * 删除 questions 表中的问题
 */
export const deleteQuestionFromTable = async (id: string): Promise<void> => {
  try {
    const { error } = await request(
      `/questions?id=eq.${id}`,
      'DELETE'
    );
    if (error) {
      console.error('删除问题失败:', error);
      throw error;
    }
  } catch (error) {
    console.error('从表删除问题失败:', error);
    throw error;
  }
};

export const addQuestions = async (questions: QuestionBankItem[]): Promise<void> => {
  console.warn('addQuestions: 操作未实现');
};

export const getAllQuestions = async (): Promise<any[]> => {
  try {
    const { data, error } = await request('/questions?order=created_at.desc');
    if (error) {
      console.error('获取题目失败:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('getAllQuestions 错误:', error);
    return [];
  }
};

export const getQuestionsByCategoryOld = async (categoryId: string): Promise<QuestionBankItem[]> => {
  try {
    const { data, error } = await request(`/question_bank?category_id=eq.${encodeURIComponent(categoryId)}&enabled=eq.true&order=created_at.desc`);
    if (error) {
      console.error('获取分类题目失败:', error);
      throw error;
    }
    return (data || []).map((row: any) => ({
      id: row.id,
      parentId: row.parent_id,
      categoryId: row.category_id,
      difficulty: row.difficulty,
      content: row.content,
      answer: row.answer,
      tags: row.tags || [],
      notes: row.notes,
      advanced: row.advanced,
      scenarios: row.scenarios,
      enabled: row.enabled,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error('getQuestionsByCategoryOld 错误:', error);
    return [];
  }
};

export const getQuestionByIdOld = async (id: string): Promise<QuestionBankItem | null> => {
  try {
    const { data, error } = await request(`/question_bank?id=eq.${encodeURIComponent(id)}&enabled=eq.true`);
    if (error) {
      console.error('获取题目失败:', error);
      throw error;
    }
    const row = data && data.length > 0 ? data[0] : null;
    if (!row) return null;
    return {
      id: row.id,
      parentId: row.parent_id,
      categoryId: row.category_id,
      difficulty: row.difficulty,
      content: row.content,
      answer: row.answer,
      tags: row.tags || [],
      notes: row.notes,
      advanced: row.advanced,
      scenarios: row.scenarios,
      enabled: row.enabled,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  } catch (error) {
    console.error('getQuestionByIdOld 错误:', error);
    return null;
  }
};

export const searchQuestions = async (keyword: string): Promise<QuestionBankItem[]> => {
  console.warn('searchQuestions: 操作未实现');
  return [];
};

export const deleteQuestion = async (id: string): Promise<void> => {
  console.warn('deleteQuestion: 操作未实现');
};

export const getQuestionCount = async (): Promise<number> => {
  try {
    const { data, error } = await request('/question_bank?enabled=eq.true&select=id');
    if (error) {
      console.error('统计题目数量失败:', error);
      throw error;
    }
    return (data || []).length;
  } catch (error) {
    console.error('getQuestionCount 错误:', error);
    return 0;
  }
};

export const getCategoryQuestionCount = async (categoryId: string): Promise<number> => {
  try {
    const { data, error } = await request(`/question_bank?category_id=eq.${encodeURIComponent(categoryId)}&enabled=eq.true&select=id`);
    if (error) {
      console.error('统计分类题目数量失败:', error);
      throw error;
    }
    return (data || []).length;
  } catch (error) {
    console.error('getCategoryQuestionCount 错误:', error);
    return 0;
  }
};

// ============================================
// 用户相关操作
// ============================================

export const initUser = async (): Promise<User> => {
  const now = new Date().toISOString();
  // 直接返回默认用户，不调用 getUser()
  return {
    id: 'user_1',
    nickname: '面试学习者',
    avatar: '',
    bio: '一个努力学习的面试准备者',
    createdAt: now,
    updatedAt: now
  };
};

export const getUser = async (): Promise<User | null> => {
  try {
    const { data, error } = await request('/users?id=eq.user_1');
    if (error) {
      console.error('获取用户失败:', error);
      throw error;
    }
    const row = data && data.length > 0 ? data[0] : null;
    if (!row) return null;
    return {
      id: row.id,
      nickname: row.nickname,
      avatar: row.avatar,
      bio: row.bio,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  } catch (error) {
    console.error('getUser 错误:', error);
    return null;
  }
};

export const updateUser = async (userData: Partial<User>): Promise<void> => {
  console.warn('updateUser: 操作未实现');
};

// ============================================
// 学习记录相关操作
// ============================================

export const getStudyRecord = async (questionId: string): Promise<StudyRecord | null> => {
  try {
    const { data, error } = await request(`/study_records?question_id=eq.${encodeURIComponent(questionId)}`);
    if (error) {
      console.error('获取学习记录失败:', error);
      throw error;
    }
    const row = data && data.length > 0 ? data[0] : null;
    if (!row) return null;
    return {
      id: row.id,
      questionId: row.question_id,
      status: row.status,
      studyCount: row.study_count,
      lastStudyTime: row.last_study_time,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  } catch (error) {
    console.error('getStudyRecord 错误:', error);
    return null;
  }
};

export const getAllStudyRecords = async (): Promise<StudyRecord[]> => {
  try {
    const { data, error } = await request('/study_records?order=last_study_time.desc');
    if (error) {
      console.error('获取学习记录失败:', error);
      throw error;
    }
    return (data || []).map((row: any) => ({
      id: row.id,
      questionId: row.question_id,
      status: row.status,
      studyCount: row.study_count,
      lastStudyTime: row.last_study_time,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error('getAllStudyRecords 错误:', error);
    return [];
  }
};

export const updateStudyStatus = async (
  questionId: string,
  status: StudyRecord['status'],
  notes?: string
): Promise<void> => {
  console.warn('updateStudyStatus: 操作未实现');
};

// ============================================
// 收藏相关操作
// ============================================

export const addFavorite = async (type: Favorite['type'], targetId: string, remark = ''): Promise<void> => {
  console.warn('addFavorite: 操作未实现');
};

export const removeFavorite = async (type: Favorite['type'], targetId: string): Promise<void> => {
  console.warn('removeFavorite: 操作未实现');
};

export const isFavorite = async (type: Favorite['type'], targetId: string): Promise<boolean> => {
  try {
    const { data, error } = await request(`/favorites?type=eq.${encodeURIComponent(type)}&target_id=eq.${encodeURIComponent(targetId)}`);
    if (error) {
      console.error('检查收藏失败:', error);
      throw error;
    }
    return !!(data && data.length > 0);
  } catch (error) {
    console.error('isFavorite 错误:', error);
    return false;
  }
};

export const getFavoritesByType = async (type: Favorite['type']): Promise<Favorite[]> => {
  try {
    const { data, error } = await request(`/favorites?type=eq.${encodeURIComponent(type)}&order=created_at.desc`);
    if (error) {
      console.error('获取收藏失败:', error);
      throw error;
    }
    return (data || []).map((row: any) => ({
      id: row.id,
      type: row.type,
      targetId: row.target_id,
      remark: row.remark,
      createdAt: row.created_at
    }));
  } catch (error) {
    console.error('getFavoritesByType 错误:', error);
    return [];
  }
};

// ============================================
// 评论相关操作
// ============================================

export const addComment = async (
  content: string,
  targetType: AppComment['targetType'],
  targetId: string,
  parentId?: string
): Promise<void> => {
  console.warn('addComment: 操作未实现');
};

export const getComments = async (
  targetType: AppComment['targetType'],
  targetId: string
): Promise<AppComment[]> => {
  try {
    const { data, error } = await request(`/comments?target_type=eq.${encodeURIComponent(targetType)}&target_id=eq.${encodeURIComponent(targetId)}&order=created_at.desc`);
    if (error) {
      console.error('获取评论失败:', error);
      throw error;
    }
    return (data || []).map((row: any) => ({
      id: row.id,
      content: row.content,
      targetType: row.target_type,
      targetId: row.target_id,
      parentId: row.parent_id,
      likes: row.likes,
      createdAt: row.created_at
    }));
  } catch (error) {
    console.error('getComments 错误:', error);
    return [];
  }
};

export const likeComment = async (commentId: string): Promise<void> => {
  console.warn('likeComment: 操作未实现');
};

// ============================================
// 搜索历史相关操作
// ============================================

export const addSearchHistory = async (keyword: string): Promise<void> => {
  console.warn('addSearchHistory: 操作未实现');
};

export const getSearchHistory = async (limit = 20): Promise<SearchHistory[]> => {
  console.warn('getSearchHistory: 操作未实现');
  return [];
};

export const clearSearchHistory = async (): Promise<void> => {
  console.warn('clearSearchHistory: 操作未实现');
};

// ============================================
// 数据导出/导入
// ============================================

export const exportData = async (): Promise<any> => {
  return {};
};

export const importData = async (data: any): Promise<void> => {
  console.warn('importData: 操作未实现');
};

// ============================================
// 数据库初始化
// ============================================

export const initDatabase = async (): Promise<void> => {
  console.log('Supabase REST API 初始化完成');
};

export const getDatabasePath = (): string => {
  return 'Supabase Cloud Database';
};

// ============================================
// 兼容原有 API 的函数
// ============================================

export const initSupabase = () => {
  console.log('Supabase REST API 初始化');
};

export const getSupabase = () => {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => ({
              single: async () => ({ data: null, error: null })
            }),
            async then(fn: any) {
              fn({ data: [], error: null });
              return { data: [], error: null };
            }
          }),
          single: async () => ({ data: null, error: null }),
          async then(fn: any) {
            fn({ data: [], error: null });
            return { data: [], error: null };
          }
        }),
        order: () => ({
          async then(fn: any) {
            fn({ data: [], error: null });
            return { data: [], error: null };
          }
        }),
        limit: () => ({
          async then(fn: any) {
            fn({ data: [], error: null });
            return { data: [], error: null };
          }
        }),
        async then(fn: any) {
          fn({ data: [], error: null });
          return { data: [], error: null };
        }
      }),
      insert: () => ({ async then(fn: any) { fn({ error: null }); } }),
      update: () => ({ eq: () => ({ async then(fn: any) { fn({ error: null }); } }) }),
      delete: () => ({ eq: () => ({ async then(fn: any) { fn({ error: null }); } }) }),
      upsert: () => ({ async then(fn: any) { fn({ error: null }); } })
    }),
    auth: {
      signInAnonymously: async () => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null })
    }
  };
};