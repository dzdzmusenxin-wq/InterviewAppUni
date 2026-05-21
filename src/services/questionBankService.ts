import type { QuestionCategory, QuestionBankItem, QuestionBankImport, User, StudyRecord, Favorite, AppComment, SearchHistory } from '@/types';
import { sampleQuestionBankData } from '@/data/sampleData';
import {
  initDatabase,
  addCategory,
  addCategories,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  addQuestion,
  addQuestions,
  getAllQuestions,
  getQuestionsByCategory,
  getQuestionById,
  searchQuestions,
  deleteQuestion,
  getQuestionCount,
  getCategoryQuestionCount,
  initUser,
  getUser,
  updateUser,
  getStudyRecord,
  getAllStudyRecords,
  updateStudyStatus,
  addFavorite,
  removeFavorite,
  isFavorite,
  getFavoritesByType,
  addComment,
  getComments,
  likeComment,
  addSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  importData,
  exportData,
  getDatabasePath
} from '@/utils/supabase';

export class QuestionBankService {
  private static instance: QuestionBankService;
  private initialized = false;

  private constructor() {}

  public static getInstance(): QuestionBankService {
    if (!QuestionBankService.instance) {
      QuestionBankService.instance = new QuestionBankService();
    }
    return QuestionBankService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    await initDatabase();
    await initUser();
    this.initialized = true;
  }

  // ===============================
  // Question Category Functions
  // ===============================

  public async addCategory(category: QuestionCategory): Promise<void> {
    await addCategory(category);
  }

  public async addCategories(categories: QuestionCategory[]): Promise<void> {
    for (const category of categories) {
      await addCategory(category);
    }
  }

  public async getAllCategories(): Promise<QuestionCategory[]> {
    return getAllCategories();
  }

  public async getCategoryById(id: string): Promise<QuestionCategory | null> {
    return getCategoryById(id);
  }

  public async deleteCategory(id: string): Promise<void> {
    await deleteCategory(id);
  }

  // ===============================
  // Question Functions
  // ===============================

  public async addQuestion(question: QuestionBankItem): Promise<void> {
    await addQuestion(question);
  }

  public async addQuestions(questions: QuestionBankItem[]): Promise<void> {
    for (const question of questions) {
      await addQuestion(question);
    }
  }

  public async getAllQuestions(): Promise<QuestionBankItem[]> {
    return getAllQuestions();
  }

  public async getQuestionsByCategory(categoryId: string): Promise<QuestionBankItem[]> {
    return getQuestionsByCategory(categoryId);
  }

  public async getQuestionById(id: string): Promise<QuestionBankItem | null> {
    return getQuestionById(id);
  }

  public async searchQuestions(keyword: string): Promise<QuestionBankItem[]> {
    return searchQuestions(keyword);
  }

  public async deleteQuestion(id: string): Promise<void> {
    await deleteQuestion(id);
  }

  public async getQuestionCount(): Promise<number> {
    return getQuestionCount();
  }

  public async getCategoryQuestionCount(categoryId: string): Promise<number> {
    return getCategoryQuestionCount(categoryId);
  }

  public async importFromJson(jsonData: QuestionBankImport): Promise<{
    success: boolean;
    message: string;
    categoriesAdded: number;
    questionsAdded: number;
  }> {
    try {
      await this.addCategories(jsonData.categories);
      await this.addQuestions(jsonData.questions);

      return {
        success: true,
        message: `导入成功！新增 ${jsonData.categories.length} 个分类，${jsonData.questions.length} 道题目`,
        categoriesAdded: jsonData.categories.length,
        questionsAdded: jsonData.questions.length
      };
    } catch (error) {
      console.error('Import error:', error);
      return {
        success: false,
        message: `导入失败：${error instanceof Error ? error.message : '未知错误'}`,
        categoriesAdded: 0,
        questionsAdded: 0
      };
    }
  }

  public generateId(): string {
    return 'q_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  public validateQuestion(question: QuestionBankItem): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!question.id) errors.push('题目ID不能为空');
    if (!question.categoryId) errors.push('分类ID不能为空');
    if (!question.content) errors.push('题目内容不能为空');
    if (!question.answer) errors.push('回答内容不能为空');

    const validDifficulties: QuestionBankItem['difficulty'][] = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(question.difficulty)) {
      errors.push(`难度等级无效，必须是：${validDifficulties.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // ===============================
  // User Functions
  // ===============================

  public async getUser(): Promise<User | null> {
    return getUser();
  }

  public async updateUser(user: Partial<User>): Promise<void> {
    await updateUser(user);
  }

  // ===============================
  // Study Record Functions
  // ===============================

  public async getStudyRecord(questionId: string): Promise<StudyRecord | null> {
    return getStudyRecord(questionId);
  }

  public async getAllStudyRecords(): Promise<StudyRecord[]> {
    return getAllStudyRecords();
  }

  public async updateStudyStatus(
    questionId: string,
    status: StudyRecord['status'],
    notes?: string
  ): Promise<void> {
    await updateStudyStatus(questionId, status, notes);
  }

  // ===============================
  // Favorite Functions
  // ===============================

  public async addFavorite(type: Favorite['type'], targetId: string, remark = ''): Promise<void> {
    await addFavorite(type, targetId, remark);
  }

  public async removeFavorite(type: Favorite['type'], targetId: string): Promise<void> {
    await removeFavorite(type, targetId);
  }

  public async isFavorite(type: Favorite['type'], targetId: string): Promise<boolean> {
    return isFavorite(type, targetId);
  }

  public async getFavoritesByType(type: Favorite['type']): Promise<Favorite[]> {
    return getFavoritesByType(type);
  }

  // ===============================
  // Comment Functions
  // ===============================

  public async addComment(
    content: string,
    targetType: AppComment['targetType'],
    targetId: string,
    parentId?: string
  ): Promise<void> {
    await addComment(content, targetType, targetId, parentId);
  }

  public async getComments(
    targetType: AppComment['targetType'],
    targetId: string
  ): Promise<AppComment[]> {
    return getComments(targetType, targetId);
  }

  public async likeComment(commentId: string): Promise<void> {
    await likeComment(commentId);
  }

  // ===============================
  // Search History Functions
  // ===============================

  public async addSearchHistory(keyword: string): Promise<void> {
    await addSearchHistory(keyword);
  }

  public async getSearchHistory(limit = 20): Promise<SearchHistory[]> {
    return getSearchHistory(limit);
  }

  public async clearSearchHistory(): Promise<void> {
    await clearSearchHistory();
  }

  // ===============================
  // 数据导入/导出
  // ===============================

  public async importSampleData(): Promise<{
    success: boolean;
    message: string;
    categoriesAdded: number;
    questionsAdded: number;
  }> {
    try {
      await this.addCategories(sampleQuestionBankData.categories);
      await this.addQuestions(sampleQuestionBankData.questions);

      return {
        success: true,
        message: `示例数据导入成功！新增 ${sampleQuestionBankData.categories.length} 个分类，${sampleQuestionBankData.questions.length} 道题目`,
        categoriesAdded: sampleQuestionBankData.categories.length,
        questionsAdded: sampleQuestionBankData.questions.length
      };
    } catch (e) {
      console.error('Import sample data error:', e);
      return {
        success: false,
        message: `导入失败：${e instanceof Error ? e.message : '未知错误'}`,
        categoriesAdded: 0,
        questionsAdded: 0
      };
    }
  }

  public async exportData(): Promise<any> {
    return await exportData();
  }

  public async importData(data: any): Promise<void> {
    await importData(data);
  }

  public getDatabasePath(): string {
    return getDatabasePath();
  }
}

export const questionBankService = QuestionBankService.getInstance();
