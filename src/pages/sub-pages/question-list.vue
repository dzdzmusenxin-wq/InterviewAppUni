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
          <Tag 
            :text="difficultyConfig[question.difficulty].label" 
            :variant="question.difficulty" 
            size="small" 
          />
        </view>
        <text class="item-title">{{ question.title }}</text>
        <view class="item-footer">
          <view class="footer-left">
            <text class="footer-text">👁 {{ formatNumber(question.views) }}</text>
            <text class="footer-text">❤️ {{ question.likes }}</text>
          </view>
          <view 
            class="proficiency-badge"
            :style="{ backgroundColor: proficiencyConfig[question.proficiency].color + '20' }"
          >
            <text 
              class="badge-text"
              :style="{ color: proficiencyConfig[question.proficiency].color }"
            >
              {{ proficiencyConfig[question.proficiency].label }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载更多 -->
    <view class="load-more">
      <text class="load-text">已经到底了~</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 题目列表页面
 * 搜索、筛选、题目列表展示
 */
import { ref, computed } from 'vue';
import { questions, difficultyConfig, proficiencyConfig, moduleConfig } from '@/data/mockData';
import type { TechModule, Question } from '@/types';
import SearchBar from '@/components/SearchBar.vue';
import Tag from '@/components/Tag.vue';

// 搜索文本
const searchText = ref('');

// 当前模块筛选
const currentModule = ref<TechModule | 'all'>('all');

// 模块筛选选项
const moduleFilters: { label: string; value: TechModule | 'all' }[] = [
  { label: '全部', value: 'all' },
  ...moduleConfig.map(m => ({ label: m.name, value: m.id as TechModule })),
];

// 筛选后的题目列表
const filteredQuestions = computed(() => {
  let result = questions;
  
  // 按模块筛选
  if (currentModule.value !== 'all') {
    result = result.filter(q => q.module === currentModule.value);
  }
  
  // 按搜索文本筛选
  if (searchText.value.trim()) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter(q => 
      q.title.toLowerCase().includes(keyword) ||
      q.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
  }
  
  return result;
});

// 设置模块筛选
const setModuleFilter = (value: TechModule | 'all') => {
  currentModule.value = value;
};

// 处理搜索
const handleSearch = () => {
  console.log('搜索:', searchText.value);
};

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// 跳转到详情
const goToDetail = (question: Question) => {
  uni.navigateTo({
    url: `/pages/sub-pages/question-detail?id=${question.id}`,
  });
};
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
}

.item-header {
  @include flex-row;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.item-tags {
  @include flex-row;
  gap: $spacing-sm;
}

.item-title {
  font-size: $font-md;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: $spacing-md;
  display: block;
}

.item-footer {
  @include flex-row;
  justify-content: space-between;
}

.footer-left {
  @include flex-row;
  gap: $spacing-lg;
}

.footer-text {
  font-size: $font-sm;
  color: $text-muted;
}

.proficiency-badge {
  padding: 4rpx 12rpx;
  border-radius: $radius-full;
}

.badge-text {
  font-size: $font-xs;
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
