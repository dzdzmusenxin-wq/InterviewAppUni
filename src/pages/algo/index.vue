<template>
  <!-- 算法练习页面 -->
  <view class="page-container">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">算法练习</text>
      <text class="page-subtitle">每日一题，保持手感</text>
    </view>

    <!-- 统计数字 -->
    <view class="stats-bar">
      <view class="stat-item">
        <text class="stat-value">{{ completedCount }}</text>
        <text class="stat-label">已完成</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <text class="stat-value">{{ totalCount }}</text>
        <text class="stat-label">总题数</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <text class="stat-value">{{ completionRate }}%</text>
        <text class="stat-label">完成率</text>
      </view>
    </view>

    <!-- 难度筛选 -->
    <view class="filter-bar">
      <view 
        v-for="filter in filters" 
        :key="filter.value"
        class="filter-item"
        :class="{ active: currentFilter === filter.value }"
        @click="setFilter(filter.value)"
      >
        <text class="filter-text">{{ filter.label }}</text>
      </view>
    </view>

    <!-- 算法列表 -->
    <view class="algo-list">
      <view 
        v-for="algo in filteredAlgos" 
        :key="algo.id"
        class="algo-card"
        :class="{ done: algo.isDone }"
        @click="goToAlgoDetail(algo)"
      >
        <view class="algo-left">
          <view class="algo-number" :class="{ done: algo.isDone }">
            <text class="number-text">{{ algo.number }}</text>
          </view>
          <view class="algo-info">
            <text class="algo-title">{{ algo.title }}</text>
            <view class="algo-tags">
              <Tag 
                v-for="tag in algo.tags.slice(0, 2)" 
                :key="tag" 
                :text="tag" 
                size="small" 
              />
            </view>
          </view>
        </view>
        <view class="algo-right">
          <Tag 
            :text="difficultyConfig[algo.difficulty].label" 
            :variant="algo.difficulty" 
            size="small" 
          />
          <text v-if="algo.isDone" class="done-icon">✓</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 算法练习页面
 * 统计数字、难度筛选、算法列表
 */
import { ref, computed } from 'vue';
import { algoQuestions, difficultyConfig } from '@/data/mockData';
import type { AlgoQuestion, Difficulty } from '@/types';
import Tag from '@/components/Tag.vue';

// 筛选选项
const filters = [
  { label: '全部', value: 'all' },
  { label: '简单', value: 'easy' },
  { label: '中等', value: 'medium' },
  { label: '困难', value: 'hard' },
];

// 当前筛选
const currentFilter = ref<string>('all');

// 统计数据
const totalCount = computed(() => algoQuestions.length);
const completedCount = computed(() => algoQuestions.filter(a => a.isDone).length);
const completionRate = computed(() => {
  return Math.round((completedCount.value / totalCount.value) * 100);
});

// 筛选后的算法列表
const filteredAlgos = computed(() => {
  if (currentFilter.value === 'all') {
    return algoQuestions;
  }
  return algoQuestions.filter(algo => algo.difficulty === currentFilter.value);
});

// 设置筛选
const setFilter = (value: string) => {
  currentFilter.value = value;
};

// 跳转到算法详情
const goToAlgoDetail = (algo: AlgoQuestion) => {
  uni.navigateTo({
    url: `/pages/sub-pages/algo-detail?id=${algo.id}`,
  });
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background-color: $bg;
  padding: $spacing-lg;
  padding-bottom: calc($spacing-lg + constant(safe-area-inset-bottom));
  padding-bottom: calc($spacing-lg + env(safe-area-inset-bottom));
}

// 页面标题
.page-header {
  margin-bottom: $spacing-xl;
}

.page-title {
  font-size: $font-title;
  font-weight: 700;
  color: $text-primary;
  display: block;
  margin-bottom: $spacing-sm;
}

.page-subtitle {
  font-size: $font-md;
  color: $text-secondary;
}

// 统计数字
.stats-bar {
  @include flex-row;
  justify-content: space-around;
  background-color: $card;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  margin-bottom: $spacing-xl;
  @include card-shadow;
}

.stat-item {
  @include flex-column;
  align-items: center;
}

.stat-value {
  font-size: $font-xxl;
  font-weight: 700;
  color: $primary;
}

.stat-label {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: $spacing-xs;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background-color: $border;
}

// 难度筛选
.filter-bar {
  @include flex-row;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  overflow-x: auto;
}

.filter-item {
  padding: $spacing-md $spacing-lg;
  background-color: $card;
  border-radius: $radius-full;
  border: 2rpx solid $border;
}

.filter-item.active {
  background-color: $primary;
  border-color: $primary;
}

.filter-text {
  font-size: $font-md;
  color: $text-secondary;
  white-space: nowrap;
}

.filter-item.active .filter-text {
  color: #FFFFFF;
}

// 算法列表
.algo-list {
  @include flex-column;
  gap: $spacing-md;
}

.algo-card {
  @include flex-row;
  justify-content: space-between;
  background-color: $card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  @include card-shadow;
}

.algo-card.done {
  opacity: 0.7;
}

.algo-left {
  @include flex-row;
  flex: 1;
}

.algo-number {
  width: 64rpx;
  height: 64rpx;
  border-radius: $radius-md;
  background-color: $bg;
  @include flex-center;
  margin-right: $spacing-md;
  flex-shrink: 0;
}

.algo-number.done {
  background-color: $success;
}

.number-text {
  font-size: $font-md;
  font-weight: 600;
  color: $text-secondary;
}

.algo-number.done .number-text {
  color: #FFFFFF;
}

.algo-info {
  @include flex-column;
}

.algo-title {
  font-size: $font-md;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.algo-tags {
  @include flex-row;
  gap: $spacing-sm;
}

.algo-right {
  @include flex-column;
  align-items: flex-end;
  gap: $spacing-sm;
}

.done-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: $success;
  color: #FFFFFF;
  font-size: $font-sm;
  @include flex-center;
}
</style>
