import type { QuestionBankImport } from '@/types';

const now = new Date().toISOString();

export const sampleQuestionBankData: QuestionBankImport = {
  version: '1.0.0',
  importTime: now,
  categories: [
    { id: 'cat_js', name: 'JavaScript', icon: '📦', sortOrder: 1, enabled: true },
    { id: 'cat_ts', name: 'TypeScript', icon: '🔷', sortOrder: 2, enabled: true },
    { id: 'cat_vue', name: 'Vue.js', icon: '💚', sortOrder: 3, enabled: true },
    { id: 'cat_react', name: 'React', icon: '⚛️', sortOrder: 4, enabled: true },
    { id: 'cat_css', name: 'CSS/样式', icon: '🎨', sortOrder: 5, enabled: true },
    { id: 'cat_performance', name: '性能优化', icon: '⚡', sortOrder: 6, enabled: true },
    { id: 'cat_architecture', name: '架构设计', icon: '🏗️', sortOrder: 7, enabled: true },
    { id: 'cat_security', name: '安全', icon: '🔒', sortOrder: 8, enabled: true },
    { id: 'cat_network', name: '网络相关', icon: '🌐', sortOrder: 9, enabled: true },
    { id: 'cat_algorithm', name: '算法题', icon: '🧮', sortOrder: 10, enabled: true }
  ],
  questions: [
    {
      id: 'react_001',
      categoryId: 'cat_react',
      difficulty: 'medium',
      content: 'React跟传统的jQuery或纯粹使用JS的区别在哪里？封装组件究竟有什么好处？',
      answer: `## React 与传统 jQuery/原生 JS 的核心区别

### 1. 核心思想：声明式 vs 命令式

**传统 jQuery/原生 JS（命令式编程）：**
\`\`\`javascript
$('#btn').click(function() {
  $('#result').hide();
  $.ajax({
    url: '/api/data',
    success: function(data) {
      $('#result').html(data);
      $('#result').fadeIn();
    }
  });
});
\`\`\`

**React（声明式编程）：**
\`\`\`jsx
function App() {
  const [data, setData] = useState(null);
  const handleClick = async () => {
    const data = await fetchData();
    setData(data);
  };
  return (
    <div>
      <button onClick={handleClick}>获取数据</button>
      {data && <Result data={data} />}
    </div>
  );
}
\`\`\`

### 2. 虚拟 DOM 的优势

React 虚拟 DOM 工作流程：
\`\`\`
数据变化 → 创建新的虚拟 DOM → Diff 算法对比 → 只更新变化的真实 DOM
\`\`\`

### 3. 组件化封装的巨大优势

1. **代码复用** - 避免重复，组件可在多处使用
2. **状态管理简化** - 关注点分离
3. **易于测试** - 每个组件可独立测试
4. **易于维护** - 修改一处，全局生效
5. **更好的团队协作** - 组件边界清晰

### 4. 单向数据流的优势

\`\`\`
父组件 props → 子组件 props.data → 孙组件 props.data
\`\`\`

数据流动清晰，bug 容易追踪。

### 总结对比表

| 特性 | React | jQuery/原生 JS |
|------|-------|---------------|
| 编程范式 | 声明式 | 命令式 |
| DOM 操作 | 虚拟 DOM 自动优化 | 手动操作 |
| 组件化 | 原生支持 | 需要额外架构 |
| 状态管理 | 响应式系统 | 手动同步 |
| 适用场景 | 复杂 SPA | 简单页面 |`,
      tags: ['React', 'jQuery', '组件化', '虚拟DOM'],
      notes: 'React 不是要替代 jQuery，而是解决不同的问题。',
      advanced: '理解 React 的核心思想：UI = f(state)',
      scenarios: '1. 大型单页应用（SPA）\n2. 需要频繁更新大量 DOM\n3. 团队协作开发',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_001_fu1',
      parentId: 'react_001',
      categoryId: 'cat_react',
      difficulty: 'medium',
      content: '追问：既然React这么好，为什么还有人在使用jQuery？',
      answer: `## jQuery 仍然被使用的场景和原因

### 1. 历史遗留项目
很多老项目迁移成本巨大，遍布 jQuery 代码。

### 2. 简单的网页场景
对于简单的页面，jQuery 开发速度可能更快：
- 简单的表单验证
- 轻量级内容展示网站
- 简单动画效果

### 3. jQuery 的优势
- DOM 操作 API 优雅简洁
- 统一处理浏览器差异
- 海量插件可用
- 入门简单

### 4. 结论
- **简单页面**：jQuery 或原生 JS 足够
- **复杂应用**：React/Vue 等框架更有优势
- **新项目**：除非特殊需求，不建议使用 jQuery`,
      tags: ['jQuery', '历史', '适用场景'],
      notes: '选择工具要根据项目需求来定，没有最好的工具，只有最适合的工具。',
      advanced: '很多 jQuery 插件已经有了 React 版本。',
      scenarios: '1. 老项目维护\n2. 简单静态页面\n3. 快速原型开发',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_002',
      categoryId: 'cat_react',
      difficulty: 'easy',
      content: '介绍常用的 React Hooks 以及它们的实现原理',
      answer: `## React Hooks 详解

### 1. useState - 状态管理
\`\`\`jsx
const [count, setCount] = useState(0);
// 惰性初始化
const [state, setState] = useState(() => computeInitialValue());
\`\`\`
实现原理：内部使用链表存储状态，按顺序读取。

### 2. useEffect - 副作用处理
\`\`\`jsx
useEffect(() => {
  const subscription = api.subscribe(handleChange);
  return () => subscription.unsubscribe(); // 清理
}, [dependency]);
\`\`\`
执行时机：无依赖=每次渲染后，空数组=仅首次，有依赖=变化时

### 3. useCallback 和 useMemo
\`\`\`jsx
const handleClick = useCallback(() => doSomething(a,b), [a,b]);
const memoizedValue = useMemo(() => computeExpensive(a,b), [a,b]);
\`\`\`

### 4. useRef - 引用
\`\`\`jsx
const timerRef = useRef(null);
const inputRef = useRef(null);
inputRef.current.focus();
\`\`\`

### 5. useContext - 上下文
\`\`\`jsx
const ThemeContext = React.createContext('light');
const theme = useContext(ThemeContext);
\`\`\`

### 6. useReducer - 复杂状态
\`\`\`jsx
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'increment' });
\`\`\`

### Hooks 规则
1. 只在顶层调用，不要在循环、条件中调用
2. 只在 React 函数组件或自定义 Hook 中调用
3. 依赖数组要完整`,
      tags: ['React', 'Hooks', 'useState', 'useEffect'],
      notes: '理解 Hooks 实现原理有助于避免使用中的坑。',
      advanced: 'Fiber 架构是 Hooks 实现的基础。',
      scenarios: '1. 状态管理\n2. 副作用处理\n3. DOM 操作\n4. 性能优化',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_002_fu1',
      parentId: 'react_002',
      categoryId: 'cat_react',
      difficulty: 'medium',
      content: '追问：为什么 Hooks 要遵守"只在顶层调用"的规则？',
      answer: `## Hooks 必须遵守顶层调用规则的原因

### 核心原因：链表顺序

Hooks 内部使用链表存储：
\`\`\`
Fiber.memorizedState:
hook1 → useState(0)
hook2 → useState('init')
hook3 → useState(null)
\`\`\`

React 按顺序读取链表，如果不按顺序调用，链表断裂，数据错乱。

### 如果不遵守规则会发生什么
\`\`\`jsx
// 首次渲染: count = 0, 不进入 if
useState(0) // hook1

// 第二次渲染: count = 1, 进入 if
useState(0) // hook1
useState('init') // hook2 ← 顺序被打乱！

// React 认为 hook2 是 'init'，但链表结构已破坏
\`\`\`

### 正确做法
\`\`\`jsx
// ✅ 使用 useMemo 处理条件逻辑
const name = useMemo(() => {
  if (showName) return 'init';
  return null;
}, [showName]);
\`\`\``,
      tags: ['Hooks', '规则', '链表', '原理'],
      notes: '这条规则是 React 保证状态正确性的基础。',
      advanced: '理解链表结构后，可以更好理解自定义 Hook 的规则。',
      scenarios: '1. 条件渲染不同组件\n2. 循环中生成多个组件\n3. 动态数量的状态',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_003',
      categoryId: 'cat_react',
      difficulty: 'medium',
      content: 'useMemo 和 useCallback 的区别是什么？各自适用于什么场景？',
      answer: `## useMemo 和 useCallback 详解

### 核心区别
| Hook | 缓存内容 | 适用场景 |
|------|----------|----------|
| useMemo | 缓存**计算结果** | expensive calculations |
| useCallback | 缓存**函数引用** | callbacks passed to child |

### useMemo
\`\`\`jsx
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
\`\`\`
适用：排序、筛选大数据，避免重复计算。

### useCallback
\`\`\`jsx
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
\`\`\`
适用：传递给 React.memo 包装的子组件。

### 性能对比
\`\`\`
不用 Hooks: Parent render → 新函数 → Child re-render
用 useCallback: Parent render → 引用相同 → Child 不 re-render
\`\`\`

### 注意事项
1. 不要过度使用，先 profile 再优化
2. 依赖数组要完整
3. 简单计算不需要 useMemo`,
      tags: ['useMemo', 'useCallback', '性能优化', 'React'],
      notes: '过早优化是万恶之源，应该用 Profiler 先找到瓶颈。',
      advanced: 'useMemo 内部使用 Object.is 进行比较。',
      scenarios: '1. 列表筛选/排序\n2. 传递给 memo 组件\n3. 作为 useEffect 依赖',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_004',
      categoryId: 'cat_react',
      difficulty: 'hard',
      content: '依赖变化如何理解？useEffect 的依赖数组应该怎么写？',
      answer: `## React 依赖变化的深度理解

### 什么是依赖变化
React 内部用 Object.is 比较依赖数组：
\`\`\`javascript
const changed = !Object.is(prevDeps, nextDeps);
\`\`\`

### 依赖数组的正确写法
**原则：包含所有使用的外部变量**
\`\`\`jsx
// ❌ 错误：遗漏依赖
useEffect(() => {
  document.title = count;
}, []); // count 遗漏！

// ✅ 正确
useEffect(() => {
  document.title = count;
}, [count]);
\`\`\`

### 常见错误
\`\`\`jsx
// ❌ setInterval 中使用 count 但没声明
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, []); // count 遗漏！

// ✅ 正确1：添加到依赖
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, [count]);

// ✅ 正确2：函数式更新（推荐）
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000);
  return () => clearInterval(id);
}, []);
\`\`\`

### 对象/函数作为依赖
\`\`\`jsx
// ❌ 每次渲染都是新对象
const options = { timeout: 1000 };
useEffect(() => api.call(options), [options]);

// ✅ 用 useMemo 稳定引用
const options = useMemo(() => ({ timeout: 1000 }), []);
useEffect(() => api.call(options), [options]);

// ✅ 或提取需要的内容
useEffect(() => {
  api.call({ timeout: 1000 });
}, [1000]);
\`\`\`

### ESLint 帮助检查
\`\`\`bash
npm install eslint-plugin-react-hooks
\`\`\`
开启 exhaustive-deps 规则。`,
      tags: ['useEffect', '依赖数组', 'React', '闭包'],
      notes: '遗漏依赖是 React 中最常见的 bug 来源。',
      advanced: '理解闭包和 Fiber 架构有助于深入理解。',
      scenarios: '1. 数据获取\n2. 事件监听\n3. 订阅/取消订阅',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_005',
      categoryId: 'cat_react',
      difficulty: 'hard',
      content: 'Fiber架构有了解过吗？大致原理是什么？有什么用？',
      answer: `## React Fiber 架构深度解析

### 为什么需要 Fiber
React 15 的问题是渲染同步且不能中断，大型组件树会阻塞主线程。

Fiber 的目标：
1. 可中断的渲染
2. 支持优先级
3. 能够暂停、恢复、终止渲染

### Fiber 的数据结构
\`\`\`javascript
{
  type: 'div',
  child: firstChild,      // 第一个子元素
  sibling: nextSibling,   // 下一个兄弟
  return: parentFiber,   // 父元素
  lanes: 0,              // 优先级赛道
  memoizedState: null,   // hooks 状态
}
\`\`\`

### 双缓存技术
\`\`\`
Current Fiber ←→ workInProgress Fiber
(已渲染)       (正在构建)
\`\`\`

### 工作流程
1. **Render 阶段（可中断）**
   - beginWork() - 从根向下
   - completeWork() - 向上返回

2. **Commit 阶段（不可中断）**
   - DOM 更新
   - 执行 useEffect
   - 切换 fiber 树

### 优先级机制
\`\`\`
SyncLane → InputContinuousLane → DefaultLane → LowPriorityLane
同步      用户输入            默认         低优先级
\`\`\`

### 对比 React 15
| 特性 | React 15 | React 16+ Fiber |
|------|----------|-----------------|
| 渲染 | 同步递归 | 可中断 |
| 优先级 | 无 | lanes 模型 |
| 中断恢复 | 不支持 | 支持 |`,
      tags: ['Fiber', 'React', '架构', '调度', '优先级'],
      notes: 'Fiber 是 React 16 最重要的架构升级。',
      advanced: '深入学习可阅读 React 源码。',
      scenarios: '1. 大型列表渲染\n2. 复杂表单\n3. 实时数据更新',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_006',
      categoryId: 'cat_performance',
      difficulty: 'hard',
      content: '如何优化页面性能？可以结合 webpack/vite 或 http 协议头来讲解',
      answer: `## 前端性能优化全面解析

### 一、构建工具优化

**Vite vs Webpack：**
\`\`\`
Webpack: 所有模块打包成 bundle
Vite: 开发时按需编译，生产时 Rollup 打包
\`\`\`

**Vite 配置：**
\`\`\`javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: { manualChunks: { vendor: ['react', 'react-dom'] } }
    },
    minify: 'terser',
    assetsInlineLimit: 4096
  }
}
\`\`\`

### 二、HTTP 缓存策略

**强缓存：**
\`\`\`
Cache-Control: max-age=31536000  # 一年内直接用
\`\`\`

**协商缓存：**
\`\`\`
ETag: "hash值"  # 比较 hash，304 表示用缓存
\`\`\`

### 三、React 性能优化

\`\`\`jsx
// React.memo
const MemoizedComponent = React.memo(Component);

// useMemo / useCallback
const data = useMemo(() => process(items), [items]);
const handler = useCallback(() => doSomething(id), [id]);

// 路由懒加载
const Detail = React.lazy(() => import('./Detail'));
\`\`\`

### 四、优化清单
| 优化项 | 预期收益 |
|--------|----------|
| 代码分割+懒加载 | -50% 首屏 JS |
| gzip 压缩 | -70% 传输大小 |
| HTTP/2 | -30% 加载时间 |
| React.memo | -20% 不必要渲染 |`,
      tags: ['性能优化', 'Webpack', 'Vite', 'HTTP', '缓存'],
      notes: '优化要有的放矢，先用 Profiler 找到瓶颈。',
      advanced: 'Web Vitals (LCP, FID, CLS) 是 Google 推出的指标标准。',
      scenarios: '1. 首屏加载优化\n2. 列表性能优化\n3. 打包体积优化',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_006_fu1',
      parentId: 'react_006',
      categoryId: 'cat_performance',
      difficulty: 'hard',
      content: '追问：具体如何做缓存？有哪些前端缓存方式？结合项目讲解',
      answer: `## 前端缓存全面解析

### 缓存层级
\`\`\`
浏览器
├── HTTP 缓存（强缓存/协商缓存）
├── Memory Cache（内存，页面关闭消失）
├── Service Worker 缓存（可编程，持久）
└── LocalStorage/IndexedDB（持久存储）
\`\`\`

### HTTP 缓存
\`\`\`nginx
# 静态资源强缓存
location ~* \\.(js|css|png|jpg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
\`\`\`

### Service Worker 缓存
\`\`\`javascript
const CACHE_NAME = 'v1';
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
\`\`\`

### 浏览器存储
\`\`\`javascript
// LocalStorage - 永久，约 5MB
localStorage.setItem('theme', 'dark');

// IndexedDB - 大量数据
const db = await idb.openDB('my-db', 1);
\`\`\`

### React Query 缓存
\`\`\`jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000
    }
  }
});
\`\`\`

### 缓存总结
| 类型 | 容量 | 生命周期 |
|------|------|----------|
| Memory | ~50MB | 页面关闭 |
| SW | 无限制 | 持久 |
| LocalStorage | ~5MB | 永久 |
| IndexedDB | 无限制 | 持久 |`,
      tags: ['缓存', 'Service Worker', 'HTTP缓存', 'LocalStorage'],
      notes: '缓存策略要根据数据特性来定。',
      advanced: 'PWA 的核心就是 Service Worker。',
      scenarios: '1. 离线应用\n2. API 缓存\n3. 静态资源缓存',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_007',
      categoryId: 'cat_react',
      difficulty: 'medium',
      content: 'React 有哪些组件传值方式？',
      answer: `## React 组件传值方式全面解析

### 1. Props（父→子）
\`\`\`jsx
function Parent() {
  return <Child name="Alice" age={25} />;
}
function Child({ name, age }) {
  return <div>{name}, {age}</div>;
}
\`\`\`

### 2. 回调函数（子→父）
\`\`\`jsx
function Parent() {
  const handleData = (data) => console.log(data);
  return <Child onData={handleData} />;
}
\`\`\`

### 3. Context（跨层级）
\`\`\`jsx
const ThemeContext = React.createContext('light');
<ThemeContext.Provider value="dark">
  <Toolbar />
</ThemeContext.Provider>;
// Toolbar: const theme = useContext(ThemeContext);
\`\`\`

### 4. useReducer（复杂状态）
\`\`\`jsx
const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'increment' });
\`\`\`

### 5. 状态管理库（Zustand/Redux）
\`\`\`jsx
// Zustand
const useStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 }))
}));
const { count } = useStore();
\`\`\`

### 6. URL 参数
\`\`\`jsx
<Route path="/user/:id" component={UserPage} />
// 组件中: const { id } = useParams();
\`\`\`

### 对比
| 方式 | 适用场景 | 推荐度 |
|------|----------|--------|
| Props | 父子通信 | ⭐⭐⭐⭐⭐ |
| 回调 | 子→父 | ⭐⭐⭐⭐⭐ |
| Context | 跨层级 | ⭐⭐⭐⭐ |
| useReducer | 复杂状态 | ⭐⭐⭐⭐ |
| 状态库 | 全局状态 | ⭐⭐⭐ |`,
      tags: ['React', '组件通信', 'Props', 'Context', '状态管理'],
      notes: '不要过度工程化，简单场景用 Props。',
      advanced: '理解单向数据流是 React 核心。',
      scenarios: '1. 父子传值\n2. 跨层级传值\n3. 全局状态',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_008',
      categoryId: 'cat_react',
      difficulty: 'easy',
      content: 'Zustand 是什么？有什么特点？和 Redux 有什么区别？',
      answer: `## Zustand 状态管理库详解

### 什么是 Zustand
轻量级（~1KB）、API 简洁的 React 状态管理库。

### 快速上手
\`\`\`bash
npm install zustand
\`\`\`

\`\`\`jsx
import { create } from 'zustand';

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((s) => ({ bears: s.bears + 1 })),
}));

function BearCounter() {
  const bears = useStore((s) => s.bears);
  return <h1>{bears} bears</h1>;
}
\`\`\`

### 核心特点
1. **极简 API** - 一个 create 函数
2. **无 Provider** - 直接使用
3. **灵活选择器**
4. **持久化支持**
\`\`\`jsx
import { persist } from 'zustand/middleware';
const useStore = create(persist((set) => ({ bears: 0 }), { name: 'bear' }));
\`\`\`

### Zustand vs Redux
| 特性 | Zustand | Redux |
|------|---------|-------|
| 体积 | ~1KB | ~7KB |
| API | 简单 | 较复杂 |
| Provider | 不需要 | 必须 |
| 学习曲线 | 平缓 | 较陡 |

### 适用场景
✅ 简单全局状态
✅ 中小型应用
✅ 快速原型

❌ 超大型应用（用 Redux）`,
      tags: ['Zustand', '状态管理', 'React', 'Redux'],
      notes: 'Zustand 设计理念是"少即是多"。',
      advanced: 'Zustand 内部用发布订阅模式，源码简洁。',
      scenarios: '1. 全局用户状态\n2. 主题设置\n3. 购物车',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_009',
      categoryId: 'cat_algorithm',
      difficulty: 'medium',
      content: 'Coding题：手写一个简易的store状态管理类，实现getStore、create、dispatch',
      answer: `## 手写简易 Store 状态管理类

### 核心实现
\`\`\`javascript
class SimpleStore {
  constructor(reducer, initialState) {
    this.reducer = reducer;
    this.state = initialState;
    this.listeners = [];
  }

  getStore() {
    return this.state;
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach(l => l(this.state));
    return action;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

function createStore(reducer, initialState) {
  return new SimpleStore(reducer, initialState);
}
\`\`\`

### 使用示例
\`\`\`javascript
const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT': return { ...state, count: state.count + 1 };
    case 'DECREMENT': return { ...state, count: state.count - 1 };
    default: return state;
  }
};

const store = createStore(reducer, { count: 0 });
store.dispatch({ type: 'INCREMENT' }); // { count: 1 }
console.log(store.getStore()); // { count: 1 }

const unsub = store.subscribe(s => console.log('更新:', s));
store.dispatch({ type: 'INCREMENT' }); // 输出: 更新: { count: 2 }
unsub();
\`\`\`

### React Hook
\`\`\`jsx
function useStore(store) {
  const [state, setState] = useState(store.getStore());
  useEffect(() => {
    return store.subscribe(setState);
  }, [store]);
  return state;
}

function Counter({ store }) {
  const { count } = useStore(store);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => store.dispatch({ type: 'INCREMENT' })}>+</button>
    </div>
  );
}
\`\`\`

### 总结
实现了 Redux 核心功能：
1. **getStore()** - 获取状态
2. **createStore()** - 创建 store
3. **dispatch()** - 更新状态
4. **subscribe()** - 订阅变化`,
      tags: ['Coding', '状态管理', 'Store', 'Redux', '面试题'],
      notes: '考察状态管理核心概念的理解。',
      advanced: '可进一步实现中间件、combineReducers。',
      scenarios: '1. 状态管理原理\n2. 前端架构设计',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_010',
      categoryId: 'cat_security',
      difficulty: 'medium',
      content: 'XSS 和 CSRF 有没有了解？如何防范？',
      answer: `## XSS 和 CSRF 攻击与防范

### 1. XSS（跨站脚本攻击）

**原理：** 攻击者在网页中注入恶意脚本。

**类型：**

1. **存储型（持久化）** - 恶意代码存入数据库
2. **反射型（非持久）** - URL 参数中的脚本被反射
3. **DOM 型** - 前端 JS 直接执行恶意脚本

**防范：**
\`\`\`javascript
// 1. 输入转义
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 2. CSP（Content Security Policy）
Content-Security-Policy: script-src 'self'

// 3. HttpOnly Cookie
Set-Cookie: sessionId=xxx; HttpOnly

// 4. React 默认转义 HTML
const userInput = '<script>alert(1)</script>';
return <div>{userInput}</div>; // 安全，不执行
\`\`\`

### 2. CSRF（跨站请求伪造）

**原理：**
\`\`\`
1. 用户登录网站 A，保留 session
2. 攻击者诱导用户访问网站 B
3. 网站 B 携带用户 cookie 向 A 发起请求
\`\`\`

**防范：**
\`\`\`javascript
// 1. CSRF Token
<input type="hidden" name="csrf_token" value="random_token" />

// 2. SameSite Cookie
Set-Cookie: sessionId=xxx; SameSite=Strict

// 3. 验证 Origin/Referer
if (req.headers.origin !== 'https://mysite.com') {
  return res.status(403).send('Forbidden');
}
\`\`\`

### 总结对比
| 类型 | 攻击方式 | 防范 |
|------|----------|------|
| XSS | 注入脚本 | 转义、CSP、HttpOnly |
| CSRF | 伪造请求 | Token、SameSite |

### 安全清单
\`\`\`
✅ 所有输入转义
✅ CSP 限制脚本来源
✅ Cookie HttpOnly + SameSite
✅ CSRF Token
✅ 敏感操作二次验证
\`\`\``,
      tags: ['安全', 'XSS', 'CSRF', '防护'],
      notes: 'XSS 和 CSRF 是 Web 安全最常见的攻击方式。',
      advanced: 'React 默认有 XSS 防护，但仍需注意安全编码。',
      scenarios: '1. 用户输入处理\n2. 富文本编辑\n3. API 安全',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_011',
      categoryId: 'cat_network',
      difficulty: 'medium',
      content: '跨域的原因和解决方案有哪些？',
      answer: `## 跨域问题的原因和解决方案

### 为什么有跨域限制？
**同源策略：** 协议+域名+端口三者相同才算同源。

\`\`\`
http://example.com:80/page.html

同源：
- http://example.com:80/other.html ✅
- http://example.com:8080/ ❌ 端口不同
- https://example.com/ ❌ 协议不同
\`\`\`

### 解决方案

**1. CORS（推荐）**
\`\`\`javascript
// 后端 Node.js
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 携带 cookie
res.header('Access-Control-Allow-Credentials', 'true');
// 前端: axios.get(url, { withCredentials: true });
\`\`\`

**2. 代理服务器**

Vite 配置：
\`\`\`javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true }
    }
  }
};
\`\`\`

Nginx 配置：
\`\`\`nginx
location /api {
  proxy_pass http://backend:3000;
}
\`\`\`

**3. JSONP（已过时）**
\`\`\`javascript
// 只能用于 GET
const script = document.createElement('script');
script.src = url + '?callback=handleData';
document.body.appendChild(script);
\`\`\`

**4. WebSocket（不受限）**
\`\`\`javascript
const ws = new WebSocket('ws://api.example.com/socket');
\`\`\`

### 对比
| 方案 | 适用范围 | 安全性 |
|------|----------|--------|
| CORS | 所有请求 | 高 |
| 代理 | 所有请求 | 高 |
| JSONP | GET | 低 |
| WebSocket | 实时 | 中 |`,
      tags: ['跨域', 'CORS', '代理', '网络安全'],
      notes: '跨域是浏览器限制，服务器之间不受限。',
      advanced: 'CORS 预检请求（OPTIONS）机制要了解。',
      scenarios: '1. 前端开发联调\n2. 微服务\n3. 第三方 API',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_012',
      categoryId: 'cat_react',
      difficulty: 'medium',
      content: 'AI 与前端的结合有哪些尝试？',
      answer: `## AI 与前端技术的结合

### 主流 AI 编程助手
| 工具 | 特点 | 适用 |
|------|------|------|
| GitHub Copilot | 代码补全、上下文 | 日常编码 |
| ChatGPT | 对话式、解释代码 | 学习、Debug |
| Cursor | IDE 集成、AI 对话 | 深度开发 |
| 通义灵码 | 中文友好 | 国内项目 |

### AI 在前端的具体应用

**1. 代码生成**
\`\`\`jsx
// 输入：// 创建用户列表组件
// 输出：
function UserList({ users }) {
  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>
          <img src={u.avatar} />
          <span>{u.name}</span>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

**2. 代码解释和 Debug**
AI 可以解释复杂代码，发现潜在问题。

**3. 智能表单验证**
\`\`\`javascript
const validateForm = (formData) => {
  const errors = {};
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) {
    errors.email = '无效邮箱';
  }
  return errors;
};
\`\`\`

**4. 语义搜索**
\`\`\`javascript
async function semanticSearch(query, documents) {
  const queryEmbedding = await embedText(query);
  const results = documents.map(doc => ({
    doc,
    similarity: cosineSimilarity(queryEmbedding, doc.embedding)
  }));
  return results.sort((a,b) => b.similarity - a.similarity);
}
\`\`\`

### AI 辅助开发工作流
\`\`\`
需求 → AI 设计 → AI 生成代码 → 人工审核 → 测试
              ↑                          ↓
              ←←←← 迭代优化 ←←←←←←←←←←←
\`\`\`

### 注意事项
**优点：**
- 提升效率 30-50%
- 减少重复工作
- 帮助学习新技术

**缺点/风险：**
- AI 代码需人工审核
- 可能有安全漏洞
- 过度依赖降低能力`,
      tags: ['AI', '前端', 'Copilot', '自动化'],
      notes: 'AI 是辅助工具，不能完全替代人类编程。',
      advanced: '了解 prompt engineering 可以更好使用 AI。',
      scenarios: '1. 代码补全\n2. 快速原型\n3. 学习新技术',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_013',
      categoryId: 'cat_react',
      difficulty: 'medium',
      content: '如何做懒加载？React 中的懒加载有哪些方式？',
      answer: `## React 懒加载全面解析

### 1. React.lazy + Suspense

**路由懒加载：**
\`\`\`jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Detail = lazy(() => import('./pages/Detail'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
\`\`\`

**组件懒加载：**
\`\`\`jsx
const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>显示图表</button>
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
\`\`\`

### 2. 动态 import

**普通组件：**
\`\`\`javascript
// 按需加载
const Module = await import('./module');

// 预加载（hover 时）
const handleHover = () => {
  import('./HeavyComponent');
};
\`\`\`

### 3. 图片懒加载

\`\`\`jsx
// 原生懒加载
<img loading="lazy" src="image.jpg" alt="..." />

// Intersection Observer
function LazyImage({ src, alt }) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : ''}
      alt={alt}
    />
  );
}
\`\`\`

### 4. 虚拟列表（长列表懒加载）

\`\`\`jsx
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </FixedSizeList>
  );
}
\`\`\`

### 5. 第三方库

\`\`\`jsx
// react-loadable
import Loadable from 'react-loadable';

const AsyncComponent = Loadable({
  loader: () => import('./Component'),
  loading: Loading,
});

// react-imported-component
import { imported } from 'react-imported-component';

const Heavy = imported(() => import('./Heavy'));
\`\`\`

### 懒加载的好处
\`\`\`
1. 减少首屏加载时间
2. 减小 bundle 体积
3. 提升用户体验
4. 节省带宽资源
\`\`\`

### 总结
| 方式 | 适用场景 |
|------|----------|
| React.lazy | 路由、组件 |
| 动态 import | 条件加载 |
| 图片懒加载 | 图片列表 |
| 虚拟列表 | 长列表 |`,
      tags: ['懒加载', 'React', '性能优化', '代码分割'],
      notes: '懒加载是性能优化的重要手段。',
      advanced: '可以结合预加载进一步优化体验。',
      scenarios: '1. 路由懒加载\n2. 图片懒加载\n3. 列表虚拟化',
      enabled: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'react_014',
      categoryId: 'cat_algorithm',
      difficulty: 'medium',
      content: 'Coding题：写一个上楼梯方案（爬楼梯问题）',
      answer: `## 爬楼梯问题（ Climbing Stairs）

### 问题描述
一个人爬楼梯，每次可以爬 1 级或 2 级，问爬 n 级楼梯有多少种方案？

### 解题思路

**规律：**
- n=1: 1 种 (1)
- n=2: 2 种 (1+1, 2)
- n=3: 3 种 (1+1+1, 1+2, 2+1)
- n=4: 5 种 (1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2)
- n=5: 8 种

规律：**斐波那契数列**！f(n) = f(n-1) + f(n-2)

### 解法一：动态规划（推荐）
\`\`\`javascript
function climbStairs(n) {
  if (n <= 2) return n;

  let dp = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

// 时间 O(n)，空间 O(n)
\`\`\`

### 解法二：空间优化（最优）
\`\`\`javascript
function climbStairs(n) {
  if (n <= 2) return n;

  let prev1 = 2;  // dp[i-1]
  let prev2 = 1;  // dp[i-2]

  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;  // dp[i]
    prev2 = prev1;               // 更新 dp[i-2]
    prev1 = curr;                // 更新 dp[i-1]
  }

  return prev1;
}

// 时间 O(n)，空间 O(1)
\`\`\`

### 解法三：递归（不推荐，会超时）
\`\`\`javascript
function climbStairs(n) {
  if (n <= 2) return n;
  return climbStairs(n - 1) + climbStairs(n - 2);
}
// 时间 O(2^n)，空间 O(n)
\`\`\`

### 解法四：矩阵快速幂（高级）
\`\`\`javascript
function climbStairs(n) {
  const matrix = [[1, 1], [1, 0]];

  function pow(matrix, n) {
    let result = [[1, 0], [0, 1]];
    let base = matrix;

    while (n > 0) {
      if (n & 1) result = multiply(result, base);
      base = multiply(base, base);
      n >>= 1;
    }

    return result;
  }

  function multiply(a, b) {
    return [
      [a[0][0]*b[0][0] + a[0][1]*b[1][0], a[0][0]*b[0][1] + a[0][1]*b[1][1]],
      [a[1][0]*b[0][0] + a[1][1]*b[1][0], a[1][0]*b[0][1] + a[1][1]*b[1][1]]
    ];
  }

  const [[a], [b]] = pow(matrix, n);
  return a;
}

// 时间 O(log n)，空间 O(1)
\`\`\`

### 变形问题

**1. 可以爬 1、2、3 级台阶**
\`\`\`javascript
function climbStairs(n) {
  if (n <= 3) return n;
  let dp = [0, 1, 2, 3];
  for (let i = 4; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2] + dp[i-3];
  }
  return dp[n];
}
\`\`\`

**2. 花费体力爬楼梯（最小花费）**
\`\`\`javascript
function minCostClimbingStairs(cost) {
  const n = cost.length;
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 0;

  for (let i = 2; i <= n; i++) {
    dp[i] = Math.min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2]);
  }

  return dp[n];
}
\`\`\`

### 总结
| 解法 | 时间 | 空间 | 说明 |
|------|------|------|------|
| 动态规划 | O(n) | O(n) | 常规 |
| 空间优化 | O(n) | O(1) | ✅ 最优 |
| 递归 | O(2^n) | O(n) | ❌ 不推荐 |
| 矩阵快速幂 | O(log n) | O(1) | 高级 |

**面试建议：** 能想到动态规划 + 空间优化即可。`,
      tags: ['Coding', '算法', '动态规划', '斐波那契', '面试题'],
      notes: '这是经典的动态规划入门题，一定要熟练掌握。',
      advanced: '矩阵快速幂是高级解法，了解即可。',
      scenarios: '1. 算法面试\n2. 动态规划入门\n3. 爬楼梯变种',
      enabled: true,
      createdAt: now,
      updatedAt: now
    }
  ]
};
