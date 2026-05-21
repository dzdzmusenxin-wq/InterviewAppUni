/**
 * 面试通 - 类型定义文件
 * 包含所有应用中使用到的 TypeScript 类型和接口
 */

// ============================================
// 基础枚举类型
// ============================================

/**
 * 技术模块类型
 */
export type TechModule = 'js' | 'ts' | 'react' | 'vue';

/**
 * 难度等级
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * 熟练程度
 */
export type Proficiency = 'none' | 'basic' | 'proficient' | 'expert';

/**
 * 场景类型
 */
export type SceneType = 'intro' | 'project' | 'technical' | 'hr';

// ============================================
// 问题相关类型
// ============================================

/**
 * 回答段落
 */
export interface AnswerSection {
  /** 段落标题 */
  heading: string;
  /** 段落图标 */
  icon: string;
  /** 段落内容 */
  content: string;
}

/**
 * 追问项
 */
export interface FollowUp {
  /** 追问问题 */
  question: string;
  /** 追问答案 */
  answer: string;
}

/**
 * 评论项
 */
export interface Comment {
  /** 评论ID */
  id: string;
  /** 评论作者 */
  author: string;
  /** 作者头像 */
  avatar: string;
  /** 评论时间 */
  time: string;
  /** 评论内容 */
  text: string;
  /** 点赞数 */
  likes: number;
  /** 回复对象（可选） */
  replyTo?: string;
  /** 引用内容（可选） */
  quote?: string;
}

/**
 * 面试问题
 */
export interface Question {
  /** 问题ID */
  id: string;
  /** 所属技术模块 */
  module: TechModule;
  /** 问题标题 */
  title: string;
  /** 问题描述 */
  description: string;
  /** 难度等级 */
  difficulty: Difficulty;
  /** 标签列表 */
  tags: string[];
  /** 浏览次数 */
  views: number;
  /** 点赞数 */
  likes: number;
  /** 评论数 */
  comments: number;
  /** 是否已收藏 */
  isFavorite: boolean;
  /** 熟练程度 */
  proficiency: Proficiency;
  /** 回答段落列表 */
  answerSections: AnswerSection[];
  /** 追问列表 */
  followUps: FollowUp[];
  /** 评论列表 */
  commentList: Comment[];
}

// ============================================
// 场景相关类型
// ============================================

/**
 * 场景项目
 */
export interface SceneItem {
  /** 场景类型 */
  type: SceneType;
  /** 场景标题 */
  title: string;
  /** 场景描述 */
  description: string;
  /** 问题数量 */
  count: number;
  /** 场景图标 */
  icon: string;
}

// ============================================
// 算法相关类型
// ============================================

/**
 * 算法题目
 */
export interface AlgoQuestion {
  /** 题目ID */
  id: string;
  /** 题号 */
  number: number;
  /** 题目标题 */
  title: string;
  /** 难度等级 */
  difficulty: Difficulty;
  /** 标签列表 */
  tags: string[];
  /** 是否已完成 */
  isDone: boolean;
}

// ============================================
// 用户相关类型
// ============================================

/**
 * 用户统计数据
 */
export interface UserStats {
  /** 连续学习天数 */
  streakDays: number;
  /** 今日学习时长（分钟） */
  todayStudyTime: number;
  /** 总学习时长（分钟） */
  totalStudyTime: number;
  /** 已完成题目数 */
  completedQuestions: number;
  /** 错题数量 */
  errorCount: number;
  /** 收藏数量 */
  favoriteCount: number;
  /** 目标每日题目数 */
  dailyGoal: number;
  /** 今日已完成题目数 */
  todayCompleted: number;
}

/**
 * 用户资料
 */
export interface UserProfile {
  /** 用户ID */
  id: string;
  /** 用户昵称 */
  nickname: string;
  /** 用户头像 */
  avatar: string;
  /** 用户简介 */
  bio: string;
  /** 用户统计数据 */
  stats: UserStats;
  /** 是否开启提醒 */
  reminderEnabled: boolean;
  /** 提醒时间 */
  reminderTime: string;
}

// ============================================
// 推荐相关类型
// ============================================

/**
 * 每日推荐
 */
export interface DailyRecommendation {
  /** 推荐ID */
  id: string;
  /** 推荐日期 */
  date: string;
  /** 推荐标题 */
  title: string;
  /** 推荐描述 */
  description: string;
  /** 问题ID */
  questionId: string;
  /** 所属模块 */
  module: TechModule;
  /** 难度等级 */
  difficulty: Difficulty;
  /** 标签列表 */
  tags: string[];
}

// ============================================
// 题库相关类型
// ============================================

/**
 * 题库分类
 */
export interface QuestionCategory {
  /** 分类ID */
  id: string;
  /** 分类名称 */
  name: string;
  /** 分类图标 */
  icon: string;
  /** 父分类ID（可选） */
  parentId?: string;
  /** 排序顺序 */
  sortOrder: number;
  /** 是否启用 */
  enabled: boolean;
}

/**
 * 题库题目（新的数据库模型 - 支持富文本和代码片段）
 */
export interface QuestionBankItem {
  /** 题目ID */
  id: string;
  /** 父级ID（用于追问等关联） */
  parentId?: string;
  /** 所属分类 */
  categoryId: string;
  /** 题目难度 */
  difficulty: Difficulty;
  /** 题目内容（支持富文本） */
  content: string;
  /** 回答内容（富文本格式，可能包含代码片段） */
  answer: string;
  /** 标签列表 */
  tags: string[];
  /** 注意事项（富文本格式，可能包含代码片段） */
  notes: string;
  /** 进阶理解（富文本格式，可能包含代码片段） */
  advanced: string;
  /** 常见应用场景（富文本格式，可能包含代码片段） */
  scenarios: string;
  /** 是否启用 */
  enabled: boolean;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 题库导入文件格式
 */
export interface QuestionBankImport {
  /** 文件版本 */
  version: string;
  /** 导入时间 */
  importTime: string;
  /** 分类列表 */
  categories: QuestionCategory[];
  /** 题目列表 */
  questions: QuestionBankItem[];
}

// ============================================
// 用户相关类型
// ============================================

/**
 * 用户信息
 */
export interface User {
  /** 用户ID */
  id: string;
  /** 用户昵称 */
  nickname: string;
  /** 用户头像 */
  avatar: string;
  /** 个人简介 */
  bio: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 学习记录
 */
export interface StudyRecord {
  /** 记录ID */
  id: string;
  /** 题目ID */
  questionId: string;
  /** 学习状态 */
  status: 'not_started' | 'learning' | 'completed' | 'mastered';
  /** 学习次数 */
  studyCount: number;
  /** 最后学习时间 */
  lastStudyTime: string;
  /** 自定义笔记 */
  notes: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 学习统计记录（用于学习时长等统计）
 */
export interface StudyStatsRecord {
  /** 记录ID */
  id: string;
  /** 日期 */
  date: string;
  /** 学习时长（分钟） */
  duration: number;
  /** 完成题目数 */
  completedCount: number;
  /** 是否正确 */
  isCorrect: boolean;
}

/**
 * 收藏
 */
export interface Favorite {
  /** 收藏ID */
  id: string;
  /** 关联类型：question | article */
  type: 'question' | 'article';
  /** 关联ID */
  targetId: string;
  /** 备注 */
  remark: string;
  /** 创建时间 */
  createdAt: string;
}

/**
 * 评论
 */
export interface AppComment {
  /** 评论ID */
  id: string;
  /** 评论内容 */
  content: string;
  /** 关联类型：question | article */
  targetType: 'question' | 'article';
  /** 关联ID */
  targetId: string;
  /** 父评论ID（用于回复） */
  parentId?: string;
  /** 点赞数 */
  likes: number;
  /** 创建时间 */
  createdAt: string;
}

/**
 * 学习统计
 */
export interface StudyStats {
  /** 总题目数 */
  totalQuestions: number;
  /** 已学习题目数 */
  studiedQuestions: number;
  /** 已掌握题目数 */
  masteredQuestions: number;
  /** 连续学习天数 */
  streakDays: number;
  /** 累计学习时长（分钟） */
  totalStudyMinutes: number;
}

/**
 * 搜索历史
 */
export interface SearchHistory {
  /** 记录ID */
  id: string;
  /** 搜索关键词 */
  keyword: string;
  /** 搜索时间 */
  searchedAt: string;
}

// ============================================
// 辅助类型
// ============================================

/**
 * 模块配置
 */
export interface ModuleConfig {
  /** 模块ID */
  id: TechModule;
  /** 模块名称 */
  name: string;
  /** 模块图标 */
  icon: string;
  /** 模块颜色 */
  color: string;
  /** 题目数量 */
  questionCount: number;
}

/**
 * 通知设置
 */
export interface NotificationSettings {
  /** 是否开启每日提醒 */
  dailyReminder: boolean;
  /** 提醒时间 */
  reminderTime: string;
  /** 是否开启目标达成通知 */
  goalAchievement: boolean;
  /** 是否开启新题上架通知 */
  newQuestionAlert: boolean;
}
