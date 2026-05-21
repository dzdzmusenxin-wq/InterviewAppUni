<template>
  <!-- 题目列表页面 -->
  <view class="page-container">
    <!-- 搜索栏 -->
    <SearchBar v-model="searchText" @confirm="handleSearch" />

    <!-- 筛选标签 -->
    <view class="filter-tags">
      <view 
        v-for="filter in moduleFilters" 
        :key="filter.value"
        class="filter-tag"
        :class="{ active: currentModule === filter.value }"
        @click="setModuleFilter(filter.value)"
      >
        <text class="tag-text">{{ filter.label }}</text>
      </view>
    </view>

    <!-- 题目列表 -->
    <view class="question-list">
      <view 
        v-for="question in filteredQuestions" 
        :key="question.id"
        class="question-item"
        @click="goToDetail(question)"
      >
        <view class="item-header">
          <view class="item-tags">
            <Tag 
              v-for="tag in question.tags.slice(0, 2)" 
              :key="tag" 
              :text="tag" 
              size="small" 
            />
          </view>
          <view class="category-badge">
            <text class="category-text">{{ question.category }}</text>
          </view>
        </view>
        <text class="item-title">{{ question.content }}</text>
        <view class="item-footer">
          <view class="footer-left">
            <text class="footer-text">📅 {{ formatDate(question.created_at) }}</text>
          </view>
          <text class="footer-arrow">&#xe6f8;</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="isLoading" class="loading-container">
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="filteredQuestions.length === 0" class="empty-container">
      <text class="empty-icon">📭</text>
      <text class="empty-text">暂无问题</text>
    </view>

    <!-- 加载更多 -->
    <view v-if="!isLoading && filteredQuestions.length > 0" class="load-more">
      <text class="load-text">已经到底了~</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 题目列表页面
 * 搜索、筛选、题目列表展示
 */
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { moduleConfig } from '@/data/mockData';
import type { TechModule } from '@/types';
import { getQuestionsByCategory, getAllQuestions } from '@/utils/supabase';
import SearchBar from '@/components/SearchBar.vue';
import Tag from '@/components/Tag.vue';

// 搜索文本
const searchText = ref('');

// 当前模块筛选
const currentModule = ref<TechModule | 'all'>('all');

// 问题列表
const questions = ref<any[]>([]);

// 加载状态
const isLoading = ref(true);

// 模块筛选选项
const moduleFilters: { label: string; value: TechModule | 'all' }[] = [
  { label: '全部', value: 'all' },
  ...moduleConfig.map(m => ({ label: m.name, value: m.id as TechModule })),
];

// 筛选后的题目列表
const filteredQuestions = computed(() => {
  let result = questions.value;
  
  // 按模块筛选
  if (currentModule.value !== 'all') {
    result = result.filter(q => {
      const category = q.category || '';
      return category.toLowerCase().includes(currentModule.value.toLowerCase()) || 
             category.toLowerCase().includes(currentModule.value);
    });
  }
  
  // 按搜索文本筛选
  if (searchText.value.trim()) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter(q => 
      (q.content || '').toLowerCase().includes(keyword) ||
      (q.tags || []).some(tag => (tag || '').toLowerCase().includes(keyword))
    );
  }
  
  return result;
});

// 设置模块筛选
const setModuleFilter = async (value: TechModule | 'all') => {
  currentModule.value = value;
  await loadQuestions();
};

// 处理搜索
const handleSearch = () => {
  console.log('搜索:', searchText.value);
};

// 加载题目
const loadQuestions = async () => {
  isLoading.value = true;
  try {
    let data: any[] = [];
    
    if (currentModule.value !== 'all') {
      // 按分类获取题目
      // 获取模块配置（包含ID和名称）
      const moduleItem = moduleConfig.find(m => m.id === currentModule.value);
      
      // 使用 OR 查询同时匹配分类名称和模块ID
      // 支持多种匹配方式：分类名称、模块ID、小写匹配
      if (moduleItem) {
        // 构建 OR 查询：匹配分类名称 或 匹配模块ID 或 匹配小写名称
        const categoryName = moduleItem.name;
        const moduleId = currentModule.value;
        
        // 先尝试获取所有题目，然后在前端进行模糊匹配
        // 这样可以避免复杂的 OR 查询
        const allQuestions = await getAllQuestions();
        
        // 在前端进行灵活匹配
        data = allQuestions.filter(q => {
          const category = (q.category || '').toLowerCase();
          const moduleNameLower = categoryName.toLowerCase();
          const moduleIdLower = moduleId.toLowerCase();
          
          // 匹配条件：分类包含模块名称 或 分类包含模块ID
          return category.includes(moduleNameLower) || 
                 category.includes(moduleIdLower);
        });
      } else {
        // 如果没有找到模块配置，直接按传入的值查询
        data = await getQuestionsByCategory(currentModule.value);
      }
    } else {
      // 获取所有题目
      data = await getAllQuestions();
    }
    
    // 处理 tags 字段，确保是数组
    questions.value = data.map(q => ({
      ...q,
      tags: Array.isArray(q.tags) ? q.tags : []
    }));
    
    console.log('加载到题目数量:', questions.value.length);
  } catch (error) {
    console.error('加载题目失败:', error);
    questions.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 格式化日期
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 跳转到详情
const goToDetail = (question: any) => {
  console.log(`[Question List] 点击题目，ID: ${question.id}`);
  console.log(`[Question List] 跳转URL: /pages/sub-pages/question-detail?id=${question.id}`);
  
  uni.navigateTo({
    url: `/pages/sub-pages/question-detail?id=${question.id}`,
    success: () => {
      console.log('[Question List] 跳转成功');
    },
    fail: (err) => {
      console.error('[Question List] 跳转失败:', err);
      uni.showToast({
        title: `跳转失败: ${err.errMsg || '未知错误'}`,
        icon: 'none',
        duration: 3000
      });
    }
  });
};

// 页面加载时获取 URL 参数并加载数据
onLoad(async (options: Record<string, string>) => {
  console.log('[Question List] onLoad 被调用，options:', options);
  
  // 如果 URL 中有模块参数，设置当前模块
  if (options.module) {
    currentModule.value = options.module as TechModule;
    console.log('[Question List] 设置模块:', currentModule.value);
  }
  
  await loadQuestions();
});

onMounted(() => {
  console.log('[Question List] onMounted 被调用');
});
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background-color: $bg;
  padding-bottom: calc($spacing-lg + constant(safe-area-inset-bottom));
  padding-bottom: calc($spacing-lg + env(safe-area-inset-bottom));
}

// 筛选标签
.filter-tags {
  @include flex-row;
  gap: $spacing-md;
  padding: 0 $spacing-lg $spacing-lg;
  overflow-x: auto;
}

.filter-tag {
  padding: $spacing-sm $spacing-md;
  background-color: $card;
  border-radius: $radius-full;
  border: 2rpx solid $border;
  flex-shrink: 0;
}

.filter-tag.active {
  background-color: $primary;
  border-color: $primary;
}

.tag-text {
  font-size: $font-sm;
  color: $text-secondary;
  white-space: nowrap;
}

.filter-tag.active .tag-text {
  color: #FFFFFF;
}

// 题目列表
.question-list {
  padding: 0 $spacing-lg;
  @include flex-column;
  gap: $spacing-md;
}

.question-item {
  background-color: $card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  @include card-shadow;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.98);
    background-color: lighten($card, 2%);
  }
}

.item-header {
  @include flex-row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.item-tags {
  @include flex-row;
  gap: $spacing-sm;
}

.category-badge {
  padding: 4rpx 12rpx;
  background-color: $primary-light;
  border-radius: $radius-full;
}

.category-text {
  font-size: $font-xs;
  color: $primary;
}

.item-title {
  font-size: $font-md;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: $spacing-md;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-footer {
  @include flex-row;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  @include flex-row;
  gap: $spacing-lg;
}

.footer-text {
  font-size: $font-sm;
  color: $text-muted;
}

.footer-arrow {
  font-size: $font-md;
  color: $text-muted;
}

// 加载状态
.loading-container {
  @include flex-center;
  padding: 100rpx;
}

.loading-text {
  font-size: $font-md;
  color: $text-muted;
}

// 空状态
.empty-container {
  @include flex-column;
  align-items: center;
  padding: 100rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: $spacing-md;
}

.empty-text {
  font-size: $font-md;
  color: $text-muted;
}

// 加载更多
.load-more {
  @include flex-center;
  padding: $spacing-xl;
}

.load-text {
  font-size: $font-sm;
  color: $text-muted;
}
</style>
