<template>
  <!-- 错题本页面 -->
  <view class="page-container">
    <!-- 统计头部 -->
    <view class="stats-header">
      <view class="stats-card">
        <text class="stats-num">{{ errorQuestions.length }}</text>
        <text class="stats-label">错题数量</text>
      </view>
      <view class="stats-card">
        <text class="stats-num">{{ reviewedCount }}</text>
        <text class="stats-label">已复习</text>
      </view>
      <view class="stats-card">
        <text class="stats-num">{{ reviewRate }}%</text>
        <text class="stats-label">复习率</text>
      </view>
    </view>

    <!-- 筛选标签 -->
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

    <!-- 错题列表 -->
    <view class="error-list">
      <view 
        v-for="question in filteredErrors" 
        :key="question.id"
        class="error-item"
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
          <view 
            v-if="question.isReviewed" 
            class="reviewed-badge"
          >
            <text class="badge-text">已复习</text>
          </view>
        </view>
        <text class="item-title">{{ question.title }}</text>
        <view class="item-footer">
          <text class="error-date">错误时间: {{ question.errorDate }}</text>
          <text class="item-arrow">&#xe6f8;</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="filteredErrors.length === 0" class="empty-state">
      <text class="empty-icon">🎉</text>
      <text class="empty-text">太棒了！暂无错题</text>
      <text class="empty-subtext">继续保持，加油！</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 错题本页面
 */
import { ref, computed } from 'vue';
import { questions } from '@/data/mockData';
import Tag from '@/components/Tag.vue';

// 错题数据（模拟）
const errorQuestions = ref([
  {
    ...questions[0],
    errorDate: '2024-01-15',
    isReviewed: false,
  },
]);

// 筛选选项
const filters = [
  { label: '全部', value: 'all' },
  { label: '未复习', value: 'unreviewed' },
  { label: '已复习', value: 'reviewed' },
];

// 当前筛选
const currentFilter = ref('all');

// 已复习数量
const reviewedCount = computed(() => {
  return errorQuestions.value.filter(q => q.isReviewed).length;
});

// 复习率
const reviewRate = computed(() => {
  if (errorQuestions.value.length === 0) return 100;
  return Math.round((reviewedCount.value / errorQuestions.value.length) * 100);
});

// 筛选后的错题列表
const filteredErrors = computed(() => {
  if (currentFilter.value === 'all') {
    return errorQuestions.value;
  }
  if (currentFilter.value === 'reviewed') {
    return errorQuestions.value.filter(q => q.isReviewed);
  }
  return errorQuestions.value.filter(q => !q.isReviewed);
});

// 设置筛选
const setFilter = (value: string) => {
  currentFilter.value = value;
};

// 跳转到详情
const goToDetail = (question: typeof errorQuestions.value[0]) => {
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
  padding: $spacing-lg;
  padding-bottom: calc($spacing-lg + constant(safe-area-inset-bottom));
  padding-bottom: calc($spacing-lg + env(safe-area-inset-bottom));
}

// 统计头部
.stats-header {
  @include flex-row;
  justify-content: space-around;
  background-color: $card;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  margin-bottom: $spacing-xl;
  @include card-shadow;
}

.stats-card {
  @include flex-column;
  align-items: center;
}

.stats-num {
  font-size: $font-xxl;
  font-weight: 700;
  color: $danger;
}

.stats-label {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: $spacing-xs;
}

// 筛选栏
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
  background-color: $danger;
  border-color: $danger;
}

.filter-text {
  font-size: $font-md;
  color: $text-secondary;
  white-space: nowrap;
}

.filter-item.active .filter-text {
  color: #FFFFFF;
}

// 错题列表
.error-list {
  @include flex-column;
  gap: $spacing-md;
}

.error-item {
  background-color: $card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  @include card-shadow;
  border-left: 6rpx solid $danger;
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

.reviewed-badge {
  padding: 4rpx 12rpx;
  background-color: $success;
  border-radius: $radius-full;
}

.badge-text {
  font-size: $font-xs;
  color: #FFFFFF;
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

.error-date {
  font-size: $font-sm;
  color: $text-muted;
}

.item-arrow {
  font-family: 'uniicons';
  font-size: $font-md;
  color: $text-muted;
}

// 空状态
.empty-state {
  @include flex-column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xxl * 3;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: $spacing-lg;
}

.empty-text {
  font-size: $font-lg;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.empty-subtext {
  font-size: $font-md;
  color: $text-secondary;
}
</style>
