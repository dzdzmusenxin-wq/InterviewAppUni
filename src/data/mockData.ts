/**
 * 面试通 - 模拟数据
 * 包含问题、场景、算法题、用户资料等完整测试数据
 */

import type {
  Question,
  SceneItem,
  AlgoQuestion,
  UserProfile,
  DailyRecommendation,
} from '../types';

// ============================================
// 面试问题数据
// ============================================

/**
 * 面试问题列表
 */
export const questions: Question[] = [
  {
    id: 'q001',
    module: 'js',
    title: '什么是闭包？请举例说明其应用场景',
    description: '请解释 JavaScript 中闭包的概念，并说明常见的使用场景和注意事项',
    difficulty: 'medium',
    tags: ['闭包', '作用域', '内存管理'],
    views: 12580,
    likes: 892,
    comments: 3,
    isFavorite: true,
    proficiency: 'proficient',
    answerSections: [
      {
        heading: '核心概念',
        icon: 'lightbulb',
        content: '闭包（Closure）是指有权访问另一个函数作用域中的变量的函数。简单来说，当一个函数返回另一个函数，并且返回的函数使用了外部函数的变量时，就形成了闭包。闭包使得这些变量不会被垃圾回收机制回收，可以在函数外部继续访问。',
      },
      {
        heading: '代码示例',
        icon: 'code',
        content: `// 基础闭包示例
function createCounter() {
  let count = 0; // 外部函数的变量
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2`,
      },
      {
        heading: '常见应用场景',
        icon: 'apps',
        content: '1. 数据封装和私有变量：使用闭包创建私有变量，实现模块化；2. 函数柯里化：将多参数函数转换为单参数函数链；3. 防抖和节流：控制函数执行频率；4. 迭代器实现：维护迭代状态；5. 回调函数：在异步操作中保持对特定数据的引用。',
      },
      {
        heading: '注意事项',
        icon: 'warning',
        content: '1. 内存泄漏风险：闭包会持有外部变量的引用，如果不及时释放，可能导致内存泄漏；2. 性能考虑：过度使用闭包会增加内存开销；3. 循环中的闭包：在循环中创建闭包时需要注意变量共享问题，可以使用 let 或立即执行函数解决；4. this 指向：闭包中的 this 指向需要特别注意，可能需要使用箭头函数或 bind 方法。',
      },
      {
        heading: '进阶理解',
        icon: 'trending-up',
        content: '从执行上下文的角度理解，闭包的形成依赖于作用域链。当函数执行完毕，其执行上下文从调用栈弹出，但由于返回的内部函数仍然引用着外部函数的变量对象，这部分内存不会被释放，从而形成了闭包。理解这一点对于调试内存问题和优化代码性能非常重要。',
      },
    ],
    followUps: [
      {
        question: '闭包和作用域链有什么关系？',
        answer: '闭包依赖于作用域链的机制。当函数被创建时，它会保存对其父级作用域的引用，形成作用域链。当函数执行时，会沿着作用域链查找变量。闭包使得即使外部函数执行完毕，内部函数仍然可以通过作用域链访问外部变量。',
      },
      {
        question: '如何在循环中正确使用闭包？',
        answer: '在 ES6 之前，通常使用立即执行函数（IIFE）来创建独立的作用域；ES6 引入 let 和 const 后，它们具有块级作用域，每次迭代都会创建新的绑定，因此可以直接在循环中使用。例如：for (let i = 0; i < 10; i++) { setTimeout(() => console.log(i), 100); } 会正确输出 0-9。',
      },
    ],
    commentList: [
      {
        id: 'c001',
        author: '前端小王',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaowang',
        time: '2024-01-15 14:30',
        text: '讲得很清楚！特别是内存泄漏那块，之前面试被问到过没答好。',
        likes: 45,
      },
      {
        id: 'c002',
        author: 'CodeMaster',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=master',
        time: '2024-01-15 16:20',
        text: '补充一点：在 React 中，useEffect 的依赖数组和闭包也有关系，需要注意 stale closure 问题。',
        likes: 32,
        replyTo: '前端小王',
      },
      {
        id: 'c003',
        author: '面试准备中',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=prepare',
        time: '2024-01-16 09:15',
        text: '收藏了！请问有没有更多关于性能优化的例子？',
        likes: 8,
        quote: '1. 内存泄漏风险：闭包会持有外部变量的引用...',
      },
    ],
  },
];

// ============================================
// 场景练习数据
// ============================================

/**
 * 场景练习列表
 */
export const scenes: SceneItem[] = [
  {
    type: 'intro',
    title: '自我介绍',
    description: '如何准备一段简洁有力的自我介绍，突出个人优势',
    count: 12,
    icon: 'user',
  },
  {
    type: 'project',
    title: '项目介绍',
    description: '如何清晰地介绍项目背景、技术选型和你的贡献',
    count: 18,
    icon: 'folder',
  },
  {
    type: 'technical',
    title: '技术深挖',
    description: '应对技术细节的追问，展示技术深度和广度',
    count: 25,
    icon: 'code',
  },
  {
    type: 'hr',
    title: 'HR 面试',
    description: '薪资谈判、离职原因、职业规划等常见问题',
    count: 15,
    icon: 'message-circle',
  },
];

// ============================================
// 算法题目数据
// ============================================

/**
 * 算法题目列表
 */
export const algoQuestions: AlgoQuestion[] = [
  {
    id: 'algo001',
    number: 1,
    title: '两数之和',
    difficulty: 'easy',
    tags: ['数组', '哈希表'],
    isDone: true,
  },
  {
    id: 'algo002',
    number: 2,
    title: '两数相加',
    difficulty: 'medium',
    tags: ['链表', '数学'],
    isDone: true,
  },
  {
    id: 'algo003',
    number: 3,
    title: '无重复字符的最长子串',
    difficulty: 'medium',
    tags: ['字符串', '滑动窗口', '哈希表'],
    isDone: false,
  },
  {
    id: 'algo004',
    number: 4,
    title: '寻找两个正序数组的中位数',
    difficulty: 'hard',
    tags: ['数组', '二分查找', '分治'],
    isDone: false,
  },
  {
    id: 'algo005',
    number: 5,
    title: '最长回文子串',
    difficulty: 'medium',
    tags: ['字符串', '动态规划'],
    isDone: false,
  },
];

// ============================================
// 用户数据
// ============================================

/**
 * 用户资料
 */
export const userProfile: UserProfile = {
  id: 'u001',
  nickname: '前端学习者',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=learner',
  bio: '正在准备大厂面试，每天进步一点点',
  stats: {
    streakDays: 15,
    todayStudyTime: 45,
    totalStudyTime: 1280,
    completedQuestions: 128,
    errorCount: 23,
    favoriteCount: 56,
    dailyGoal: 5,
    todayCompleted: 3,
  },
  reminderEnabled: true,
  reminderTime: '20:00',
};

// ============================================
// 每日推荐数据
// ============================================

/**
 * 每日推荐列表
 */
export const dailyRecommendations: DailyRecommendation[] = [
  {
    id: 'rec001',
    date: '2024-01-16',
    title: 'JavaScript 事件循环机制详解',
    description: '深入理解宏任务、微任务和事件循环的执行顺序，这是面试中的高频考点',
    questionId: 'q002',
    module: 'js',
    difficulty: 'hard',
    tags: ['事件循环', 'Promise', '异步编程'],
  },
  {
    id: 'rec002',
    date: '2024-01-16',
    title: 'React Hooks 使用规范',
    description: '掌握 Hooks 的最佳实践，避免常见的使用错误',
    questionId: 'q003',
    module: 'react',
    difficulty: 'medium',
    tags: ['Hooks', 'useEffect', 'useState'],
  },
];

// ============================================
// 辅助数据
// ============================================

/**
 * 技术模块配置
 */
export const moduleConfig = [
  {
    id: 'js' as const,
    name: 'JavaScript',
    icon: 'javascript',
    color: '#F7DF1E',
    questionCount: 256,
  },
  {
    id: 'ts' as const,
    name: 'TypeScript',
    icon: 'typescript',
    color: '#3178C6',
    questionCount: 128,
  },
  {
    id: 'react' as const,
    name: 'React',
    icon: 'react',
    color: '#61DAFB',
    questionCount: 186,
  },
  {
    id: 'vue' as const,
    name: 'Vue',
    icon: 'vue',
    color: '#42B883',
    questionCount: 164,
  },
];

/**
 * 难度标签配置
 */
export const difficultyConfig = {
  easy: { label: '简单', color: '#10B981', bgColor: '#D1FAE5' },
  medium: { label: '中等', color: '#F59E0B', bgColor: '#FEF3C7' },
  hard: { label: '困难', color: '#EF4444', bgColor: '#FEE2E2' },
};

/**
 * 熟练度标签配置
 */
export const proficiencyConfig = {
  none: { label: '未学习', color: '#94A3B8', icon: 'circle' },
  basic: { label: '了解', color: '#3B82F6', icon: 'check-circle' },
  proficient: { label: '掌握', color: '#10B981', icon: 'star' },
  expert: { label: '精通', color: '#F59E0B', icon: 'crown' },
};

/**
 * 学习日历模拟数据（最近30天）
 */
export const studyCalendarData = [
  { date: '2024-01-01', count: 3, duration: 45 },
  { date: '2024-01-02', count: 5, duration: 60 },
  { date: '2024-01-03', count: 2, duration: 30 },
  { date: '2024-01-04', count: 4, duration: 50 },
  { date: '2024-01-05', count: 0, duration: 0 },
  { date: '2024-01-06', count: 6, duration: 90 },
  { date: '2024-01-07', count: 3, duration: 40 },
  { date: '2024-01-08', count: 4, duration: 55 },
  { date: '2024-01-09', count: 5, duration: 70 },
  { date: '2024-01-10', count: 2, duration: 25 },
  { date: '2024-01-11', count: 0, duration: 0 },
  { date: '2024-01-12', count: 7, duration: 100 },
  { date: '2024-01-13', count: 4, duration: 50 },
  { date: '2024-01-14', count: 5, duration: 65 },
  { date: '2024-01-15', count: 3, duration: 45 },
  { date: '2024-01-16', count: 3, duration: 45 },
];
