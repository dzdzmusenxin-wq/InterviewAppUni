import type {
  QuestionCategory,
  QuestionBankItem,
  User,
  StudyRecord,
  Favorite,
  AppComment,
  SearchHistory
} from '@/types';

/**
 * 数据库名称
 */
const DB_NAME = 'interview_app.db';

/**
 * 数据库版本
 */
const DB_VERSION = 1;

/**
 * 数据库路径 (App 端专用)
 */
const DB_PATH = '_doc/' + DB_NAME;

/**
 * 数据库对象
 */
let db: any = null;

/**
 * 是否已初始化
 */
let isInitialized = false;

/**
 * 检查是否在 App 环境
 */
const isAppEnv = () => {
  return typeof plus !== 'undefined' && plus.sqlite;
};

/**
 * 打开数据库
 */
const openDatabase = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!isAppEnv()) {
      console.warn('当前环境不支持 SQLite，使用 localStorage 作为降级方案');
      resolve(false);
      return;
    }

    try {
      plus.sqlite.openDatabase({
        name: DB_NAME,
        path: DB_PATH,
        success: () => {
          console.log('数据库打开成功');
          db = true;
          resolve(true);
        },
        fail: (e: any) => {
          console.error('数据库打开失败:', e);
          db = null;
          resolve(false);
        }
      });
    } catch (e) {
      console.error('打开数据库异常:', e);
      db = null;
      resolve(false);
    }
  });
};

/**
 * 执行 SQL 语句
 */
const executeSql = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!isAppEnv() || !db) {
      reject(new Error('数据库未打开'));
      return;
    }

    try {
      // 将参数替换到 SQL 中（简易实现）
      let finalSql = sql;
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const value = typeof param === 'string' ? `'${param.replace(/'/g, "''")}'` : param;
        finalSql = finalSql.replace('?', String(value));
      }
      
      plus.sqlite.selectSql({
        name: DB_NAME,
        sql: finalSql,
        success: (res: any) => {
          resolve(res);
        },
        fail: (e: any) => {
          console.error('SQL 执行失败:', finalSql, e);
          reject(e);
        }
      });
    } catch (e) {
      console.error('执行 SQL 异常:', e);
      reject(e);
    }
  });
};

/**
 * 执行 INSERT/UPDATE/DELETE 语句
 */
const executeUpdate = async (sql: string, params: any[] = []): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!isAppEnv() || !db) {
      reject(new Error('数据库未打开'));
      return;
    }

    try {
      // 将参数替换到 SQL 中（简易实现）
      let finalSql = sql;
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const value = typeof param === 'string' ? `'${param.replace(/'/g, "''")}'` : param;
        finalSql = finalSql.replace('?', String(value));
      }
      
      plus.sqlite.executeSql({
        name: DB_NAME,
        sql: [finalSql],
        success: () => {
          resolve(1);
        },
        fail: (e: any) => {
          console.error('SQL 更新失败:', finalSql, e);
          reject(e);
        }
      });
    } catch (e) {
      console.error('执行更新 SQL 异常:', e);
      reject(e);
    }
  });
};

/**
 * 创建表
 */
const createTables = async (): Promise<void> => {
  if (!isAppEnv() || !db) return;

  const tables = [
    `CREATE TABLE IF NOT EXISTS question_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT DEFAULT '',
      parent_id TEXT,
      sort_order INTEGER DEFAULT 0,
      enabled INTEGER DEFAULT 1
    )`,
    `CREATE TABLE IF NOT EXISTS question_bank (
      id TEXT PRIMARY KEY,
      parent_id TEXT,
      category_id TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      content TEXT NOT NULL,
      answer TEXT NOT NULL,
      tags TEXT,
      notes TEXT,
      advanced TEXT,
      scenarios TEXT,
      enabled INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nickname TEXT NOT NULL,
      avatar TEXT,
      bio TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS study_records (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL,
      status TEXT NOT NULL,
      study_count INTEGER DEFAULT 0,
      last_study_time TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      remark TEXT,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      parent_id TEXT,
      likes INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS search_history (
      id TEXT PRIMARY KEY,
      keyword TEXT NOT NULL,
      searched_at TEXT NOT NULL
    )`
  ];

  for (const sql of tables) {
    try {
      await executeUpdate(sql);
    } catch (e) {
      console.error('创建表失败:', e);
    }
  }
};

/**
 * 内存存储（降级方案）
 */
const memoryStore = {
  categories: [] as QuestionCategory[],
  questions: [] as QuestionBankItem[],
  user: null as User | null,
  studyRecords: [] as StudyRecord[],
  favorites: [] as Favorite[],
  comments: [] as AppComment[],
  searchHistory: [] as SearchHistory[],
  initialized: false
};

/**
 * 从 localStorage 加载数据（降级方案）
 */
const loadFromLocalStorage = () => {
  const keys = ['categories', 'questions', 'user', 'studyRecords', 'favorites', 'comments', 'searchHistory'];
  for (const key of keys) {
    const data = uni.getStorageSync('db_' + key);
    if (data) {
      (memoryStore as any)[key] = data;
    }
  }
  memoryStore.initialized = true;
};

/**
 * 保存到 localStorage（降级方案）
 */
const saveToLocalStorage = (key: string) => {
  try {
    uni.setStorageSync('db_' + key, (memoryStore as any)[key]);
  } catch (e) {
    console.error('保存失败:', e);
  }
};

// ============================================
// 初始化数据库
// ============================================

export const initDatabase = async (): Promise<void> => {
  if (isInitialized) return;

  const dbOpened = await openDatabase();
  if (dbOpened) {
    await createTables();
  } else {
    loadFromLocalStorage();
  }
  isInitialized = true;
};

// ============================================
// 分类相关操作
// ============================================

export const addCategory = async (category: QuestionCategory): Promise<void> => {
  if (!isAppEnv() || !db) {
    const index = memoryStore.categories.findIndex(c => c.id === category.id);
    if (index > -1) {
      memoryStore.categories[index] = category;
    } else {
      memoryStore.categories.push(category);
    }
    saveToLocalStorage('categories');
    return;
  }

  const sql = `
    INSERT OR REPLACE INTO question_categories (id, name, icon, parent_id, sort_order, enabled)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await executeUpdate(sql, [
    category.id,
    category.name,
    category.icon,
    category.parentId || null,
    category.sortOrder,
    category.enabled ? 1 : 0
  ]);
};

export const addCategories = async (categories: QuestionCategory[]): Promise<void> => {
  for (const category of categories) {
    await addCategory(category);
  }
};

export const getAllCategories = async (): Promise<QuestionCategory[]> => {
  if (!isAppEnv() || !db) {
    return memoryStore.categories.filter(c => c.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const sql = 'SELECT * FROM question_categories WHERE enabled = 1 ORDER BY sort_order ASC';
  const result = await executeSql(sql);
  return result.map((row: any) => ({
    id: row.id,
    name: row.name,
    icon: row.icon,
    parentId: row.parent_id,
    sortOrder: row.sort_order,
    enabled: row.enabled === 1
  }));
};

export const getCategoryById = async (id: string): Promise<QuestionCategory | null> => {
  if (!isAppEnv() || !db) {
    return memoryStore.categories.find(c => c.id === id && c.enabled) || null;
  }

  const sql = 'SELECT * FROM question_categories WHERE id = ? AND enabled = 1';
  const result = await executeSql(sql, [id]);
  if (result.length === 0) return null;
  const row = result[0];
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    parentId: row.parent_id,
    sortOrder: row.sort_order,
    enabled: row.enabled === 1
  };
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (!isAppEnv() || !db) {
    memoryStore.categories = memoryStore.categories.filter(c => c.id !== id);
    saveToLocalStorage('categories');
    return;
  }

  const sql = 'DELETE FROM question_categories WHERE id = ?';
  await executeUpdate(sql, [id]);
};

// ============================================
// 题目相关操作
// ============================================

export const addQuestion = async (question: QuestionBankItem): Promise<void> => {
  if (!isAppEnv() || !db) {
    const index = memoryStore.questions.findIndex(q => q.id === question.id);
    if (index > -1) {
      memoryStore.questions[index] = question;
    } else {
      memoryStore.questions.push(question);
    }
    saveToLocalStorage('questions');
    return;
  }

  const sql = `
    INSERT OR REPLACE INTO question_bank (
      id, parent_id, category_id, difficulty, content, answer, tags, notes, advanced, scenarios, enabled, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await executeUpdate(sql, [
    question.id,
    question.parentId || null,
    question.categoryId,
    question.difficulty,
    question.content,
    question.answer,
    JSON.stringify(question.tags),
    question.notes,
    question.advanced,
    question.scenarios,
    question.enabled ? 1 : 0,
    question.createdAt,
    question.updatedAt
  ]);
};

export const addQuestions = async (questions: QuestionBankItem[]): Promise<void> => {
  for (const question of questions) {
    await addQuestion(question);
  }
};

export const getAllQuestions = async (): Promise<QuestionBankItem[]> => {
  if (!isAppEnv() || !db) {
    return [...memoryStore.questions.filter(q => q.enabled)].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const sql = 'SELECT * FROM question_bank WHERE enabled = 1 ORDER BY created_at DESC';
  const result = await executeSql(sql);
  return result.map((row: any) => ({
    id: row.id,
    parentId: row.parent_id,
    categoryId: row.category_id,
    difficulty: row.difficulty,
    content: row.content,
    answer: row.answer,
    tags: row.tags ? JSON.parse(row.tags) : [],
    notes: row.notes,
    advanced: row.advanced,
    scenarios: row.scenarios,
    enabled: row.enabled === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
};

export const getQuestionsByCategory = async (categoryId: string): Promise<QuestionBankItem[]> => {
  if (!isAppEnv() || !db) {
    return [...memoryStore.questions.filter(q => q.categoryId === categoryId && q.enabled)].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const sql = 'SELECT * FROM question_bank WHERE category_id = ? AND enabled = 1 ORDER BY created_at DESC';
  const result = await executeSql(sql, [categoryId]);
  return result.map((row: any) => ({
    id: row.id,
    parentId: row.parent_id,
    categoryId: row.category_id,
    difficulty: row.difficulty,
    content: row.content,
    answer: row.answer,
    tags: row.tags ? JSON.parse(row.tags) : [],
    notes: row.notes,
    advanced: row.advanced,
    scenarios: row.scenarios,
    enabled: row.enabled === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
};

export const getQuestionById = async (id: string): Promise<QuestionBankItem | null> => {
  if (!isAppEnv() || !db) {
    return memoryStore.questions.find(q => q.id === id && q.enabled) || null;
  }

  const sql = 'SELECT * FROM question_bank WHERE id = ? AND enabled = 1';
  const result = await executeSql(sql, [id]);
  if (result.length === 0) return null;
  const row = result[0];
  return {
    id: row.id,
    parentId: row.parent_id,
    categoryId: row.category_id,
    difficulty: row.difficulty,
    content: row.content,
    answer: row.answer,
    tags: row.tags ? JSON.parse(row.tags) : [],
    notes: row.notes,
    advanced: row.advanced,
    scenarios: row.scenarios,
    enabled: row.enabled === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

export const searchQuestions = async (keyword: string): Promise<QuestionBankItem[]> => {
  if (!isAppEnv() || !db) {
    const lowerKeyword = keyword.toLowerCase();
    return [...memoryStore.questions.filter(q =>
      q.enabled && (
        q.content.toLowerCase().includes(lowerKeyword) ||
        q.tags.some(t => t.toLowerCase().includes(lowerKeyword))
      )
    )].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const sql = `SELECT * FROM question_bank WHERE enabled = 1 AND (content LIKE ? OR tags LIKE ?) ORDER BY created_at DESC`;
  const searchValue = '%' + keyword + '%';
  const result = await executeSql(sql, [searchValue, searchValue]);
  return result.map((row: any) => ({
    id: row.id,
    parentId: row.parent_id,
    categoryId: row.category_id,
    difficulty: row.difficulty,
    content: row.content,
    answer: row.answer,
    tags: row.tags ? JSON.parse(row.tags) : [],
    notes: row.notes,
    advanced: row.advanced,
    scenarios: row.scenarios,
    enabled: row.enabled === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
};

export const deleteQuestion = async (id: string): Promise<void> => {
  if (!isAppEnv() || !db) {
    memoryStore.questions = memoryStore.questions.filter(q => q.id !== id);
    saveToLocalStorage('questions');
    return;
  }

  const sql = 'DELETE FROM question_bank WHERE id = ?';
  await executeUpdate(sql, [id]);
};

export const getQuestionCount = async (): Promise<number> => {
  if (!isAppEnv() || !db) {
    return memoryStore.questions.filter(q => q.enabled).length;
  }

  const sql = 'SELECT COUNT(*) as count FROM question_bank WHERE enabled = 1';
  const result = await executeSql(sql);
  return result[0].count;
};

export const getCategoryQuestionCount = async (categoryId: string): Promise<number> => {
  if (!isAppEnv() || !db) {
    return memoryStore.questions.filter(q => q.categoryId === categoryId && q.enabled).length;
  }

  const sql = 'SELECT COUNT(*) as count FROM question_bank WHERE category_id = ? AND enabled = 1';
  const result = await executeSql(sql, [categoryId]);
  return result[0].count;
};

// ============================================
// 用户相关操作
// ============================================

export const initUser = async (): Promise<User> => {
  const now = new Date().toISOString();
  let user = await getUser();

  if (!user) {
    user = {
      id: 'user_1',
      nickname: '面试学习者',
      avatar: '',
      bio: '一个努力学习的面试准备者',
      createdAt: now,
      updatedAt: now
    };
    await updateUser(user);
  }

  return user;
};

export const getUser = async (): Promise<User | null> => {
  if (!isAppEnv() || !db) {
    return memoryStore.user;
  }

  const sql = 'SELECT * FROM users LIMIT 1';
  const result = await executeSql(sql);
  if (result.length === 0) return null;
  const row = result[0];
  return {
    id: row.id,
    nickname: row.nickname,
    avatar: row.avatar,
    bio: row.bio,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

export const updateUser = async (userData: Partial<User>): Promise<void> => {
  const currentUser = await getUser();
  const now = new Date().toISOString();

  if (!isAppEnv() || !db) {
    if (currentUser) {
      memoryStore.user = { ...currentUser, ...userData, updatedAt: now };
    } else {
      memoryStore.user = {
        id: 'user_1',
        nickname: userData.nickname || '面试学习者',
        avatar: userData.avatar || '',
        bio: userData.bio || '',
        createdAt: now,
        updatedAt: now
      };
    }
    saveToLocalStorage('user');
    return;
  }

  if (currentUser) {
    const sql = `
      UPDATE users SET nickname = ?, avatar = ?, bio = ?, updated_at = ? WHERE id = ?
    `;
    await executeUpdate(sql, [
      userData.nickname || currentUser.nickname,
      userData.avatar !== undefined ? userData.avatar : currentUser.avatar,
      userData.bio !== undefined ? userData.bio : currentUser.bio,
      now,
      currentUser.id
    ]);
  } else {
    const sql = `
      INSERT INTO users (id, nickname, avatar, bio, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)
    `;
    await executeUpdate(sql, [
      'user_1',
      userData.nickname || '面试学习者',
      userData.avatar || '',
      userData.bio || '',
      now,
      now
    ]);
  }
};

// ============================================
// 学习记录相关操作
// ============================================

export const getStudyRecord = async (questionId: string): Promise<StudyRecord | null> => {
  if (!isAppEnv() || !db) {
    return memoryStore.studyRecords.find(r => r.questionId === questionId) || null;
  }

  const sql = 'SELECT * FROM study_records WHERE question_id = ?';
  const result = await executeSql(sql, [questionId]);
  if (result.length === 0) return null;
  const row = result[0];
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
};

export const getAllStudyRecords = async (): Promise<StudyRecord[]> => {
  if (!isAppEnv() || !db) {
    return [...memoryStore.studyRecords].sort((a, b) =>
      new Date(b.lastStudyTime).getTime() - new Date(a.lastStudyTime).getTime()
    );
  }

  const sql = 'SELECT * FROM study_records ORDER BY last_study_time DESC';
  const result = await executeSql(sql);
  return result.map((row: any) => ({
    id: row.id,
    questionId: row.question_id,
    status: row.status,
    studyCount: row.study_count,
    lastStudyTime: row.last_study_time,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
};

export const updateStudyStatus = async (
  questionId: string,
  status: StudyRecord['status'],
  notes?: string
): Promise<void> => {
  const now = new Date().toISOString();
  const existingRecord = await getStudyRecord(questionId);

  if (!isAppEnv() || !db) {
    if (existingRecord) {
      const index = memoryStore.studyRecords.findIndex(r => r.questionId === questionId);
      memoryStore.studyRecords[index] = {
        ...existingRecord,
        status,
        studyCount: existingRecord.studyCount + 1,
        lastStudyTime: now,
        notes: notes !== undefined ? notes : existingRecord.notes,
        updatedAt: now
      };
    } else {
      memoryStore.studyRecords.push({
        id: 'record_' + Date.now(),
        questionId,
        status,
        studyCount: 1,
        lastStudyTime: now,
        notes: notes || '',
        createdAt: now,
        updatedAt: now
      });
    }
    saveToLocalStorage('studyRecords');
    return;
  }

  if (existingRecord) {
    const sql = `
      UPDATE study_records SET status = ?, study_count = ?, last_study_time = ?, notes = ?, updated_at = ? WHERE id = ?
    `;
    await executeUpdate(sql, [
      status,
      existingRecord.studyCount + 1,
      now,
      notes !== undefined ? notes : existingRecord.notes,
      now,
      existingRecord.id
    ]);
  } else {
    const sql = `
      INSERT INTO study_records (id, question_id, status, study_count, last_study_time, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await executeUpdate(sql, [
      'record_' + Date.now(),
      questionId,
      status,
      1,
      now,
      notes || '',
      now,
      now
    ]);
  }
};

// ============================================
// 收藏相关操作
// ============================================

export const addFavorite = async (type: Favorite['type'], targetId: string, remark = ''): Promise<void> => {
  const now = new Date().toISOString();
  const favorite: Favorite = {
    id: 'fav_' + Date.now(),
    type,
    targetId,
    remark,
    createdAt: now
  };

  if (!isAppEnv() || !db) {
    memoryStore.favorites.push(favorite);
    saveToLocalStorage('favorites');
    return;
  }

  const sql = `
    INSERT INTO favorites (id, type, target_id, remark, created_at) VALUES (?, ?, ?, ?, ?)
  `;
  await executeUpdate(sql, [favorite.id, favorite.type, favorite.targetId, favorite.remark, favorite.createdAt]);
};

export const removeFavorite = async (type: Favorite['type'], targetId: string): Promise<void> => {
  if (!isAppEnv() || !db) {
    memoryStore.favorites = memoryStore.favorites.filter(f => !(f.type === type && f.targetId === targetId));
    saveToLocalStorage('favorites');
    return;
  }

  const sql = 'DELETE FROM favorites WHERE type = ? AND target_id = ?';
  await executeUpdate(sql, [type, targetId]);
};

export const isFavorite = async (type: Favorite['type'], targetId: string): Promise<boolean> => {
  if (!isAppEnv() || !db) {
    return memoryStore.favorites.some(f => f.type === type && f.targetId === targetId);
  }

  const sql = 'SELECT COUNT(*) as count FROM favorites WHERE type = ? AND target_id = ?';
  const result = await executeSql(sql, [type, targetId]);
  return result[0].count > 0;
};

export const getFavoritesByType = async (type: Favorite['type']): Promise<Favorite[]> => {
  if (!isAppEnv() || !db) {
    return [...memoryStore.favorites.filter(f => f.type === type)].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const sql = 'SELECT * FROM favorites WHERE type = ? ORDER BY created_at DESC';
  const result = await executeSql(sql, [type]);
  return result.map((row: any) => ({
    id: row.id,
    type: row.type,
    targetId: row.target_id,
    remark: row.remark,
    createdAt: row.created_at
  }));
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
  const now = new Date().toISOString();
  const comment: AppComment = {
    id: 'comment_' + Date.now(),
    content,
    targetType,
    targetId,
    parentId,
    likes: 0,
    createdAt: now
  };

  if (!isAppEnv() || !db) {
    memoryStore.comments.push(comment);
    saveToLocalStorage('comments');
    return;
  }

  const sql = `
    INSERT INTO comments (id, content, target_type, target_id, parent_id, likes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  await executeUpdate(sql, [
    comment.id,
    comment.content,
    comment.targetType,
    comment.targetId,
    comment.parentId || null,
    comment.likes,
    comment.createdAt
  ]);
};

export const getComments = async (
  targetType: AppComment['targetType'],
  targetId: string
): Promise<AppComment[]> => {
  if (!isAppEnv() || !db) {
    return [...memoryStore.comments.filter(c => c.targetType === targetType && c.targetId === targetId)].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const sql = 'SELECT * FROM comments WHERE target_type = ? AND target_id = ? ORDER BY created_at DESC';
  const result = await executeSql(sql, [targetType, targetId]);
  return result.map((row: any) => ({
    id: row.id,
    content: row.content,
    targetType: row.target_type,
    targetId: row.target_id,
    parentId: row.parent_id,
    likes: row.likes,
    createdAt: row.created_at
  }));
};

export const likeComment = async (commentId: string): Promise<void> => {
  if (!isAppEnv() || !db) {
    const index = memoryStore.comments.findIndex(c => c.id === commentId);
    if (index > -1) {
      memoryStore.comments[index].likes += 1;
      saveToLocalStorage('comments');
    }
    return;
  }

  const sql = 'UPDATE comments SET likes = likes + 1 WHERE id = ?';
  await executeUpdate(sql, [commentId]);
};

// ============================================
// 搜索历史相关操作
// ============================================

export const addSearchHistory = async (keyword: string): Promise<void> => {
  const now = new Date().toISOString();

  if (!isAppEnv() || !db) {
    // 移除相同的关键词
    memoryStore.searchHistory = memoryStore.searchHistory.filter(h => h.keyword !== keyword);
    // 插入到最前面
    memoryStore.searchHistory.unshift({
      id: 'search_' + Date.now(),
      keyword,
      searchedAt: now
    });
    // 只保留最近50条
    if (memoryStore.searchHistory.length > 50) {
      memoryStore.searchHistory = memoryStore.searchHistory.slice(0, 50);
    }
    saveToLocalStorage('searchHistory');
    return;
  }

  // 先删除相同的关键词
  const deleteSql = 'DELETE FROM search_history WHERE keyword = ?';
  await executeUpdate(deleteSql, [keyword]);

  // 插入新记录
  const insertSql = 'INSERT INTO search_history (id, keyword, searched_at) VALUES (?, ?, ?)';
  await executeUpdate(insertSql, ['search_' + Date.now(), keyword, now]);

  // 只保留最近50条
  const cleanSql = 'DELETE FROM search_history WHERE id NOT IN (SELECT id FROM search_history ORDER BY searched_at DESC LIMIT 50)';
  await executeUpdate(cleanSql);
};

export const getSearchHistory = async (limit = 20): Promise<SearchHistory[]> => {
  if (!isAppEnv() || !db) {
    return memoryStore.searchHistory.slice(0, limit);
  }

  const sql = 'SELECT * FROM search_history ORDER BY searched_at DESC LIMIT ?';
  const result = await executeSql(sql, [limit]);
  return result.map((row: any) => ({
    id: row.id,
    keyword: row.keyword,
    searchedAt: row.searched_at
  }));
};

export const clearSearchHistory = async (): Promise<void> => {
  if (!isAppEnv() || !db) {
    memoryStore.searchHistory = [];
    saveToLocalStorage('searchHistory');
    return;
  }

  const sql = 'DELETE FROM search_history';
  await executeUpdate(sql);
};

// ============================================
// 数据导出/导入
// ============================================

export const exportData = async (): Promise<any> => {
  const categories = await getAllCategories();
  const questions = await getAllQuestions();
  const user = await getUser();
  const studyRecords = await getAllStudyRecords();
  const favorites = await getFavoritesByType('question');
  const searchHistory = await getSearchHistory(50);

  return {
    categories,
    questions,
    user,
    studyRecords,
    favorites,
    comments: [],
    searchHistory,
    exportTime: new Date().toISOString()
  };
};

export const importData = async (data: any): Promise<void> => {
  if (data.categories) await addCategories(data.categories);
  if (data.questions) await addQuestions(data.questions);
};

// ============================================
// 获取数据库文件路径
// ============================================

export const getDatabasePath = (): string => {
  if (isAppEnv()) {
    return DB_PATH;
  }
  return 'localStorage (H5/小程序)';
};
