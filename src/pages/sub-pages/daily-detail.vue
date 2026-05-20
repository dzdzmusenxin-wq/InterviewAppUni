<template>
  <!-- 每日推荐详情页面 -->
  <view class="page-container">
    <!-- 日期头部 -->
    <view class="date-header">
      <text class="date-icon">📅</text>
      <text class="date-text">{{ recommendation.date }}</text>
    </view>

    <!-- 推荐卡片 -->
    <Card class="recommend-card">
      <view class="card-header">
        <Tag text="今日推荐" variant="hot" />
        <Tag 
          :text="difficultyConfig[recommendation.difficulty].label" 
          :variant="recommendation.difficulty" 
          size="small" 
        />
      </view>
      <text class="recommend-title">{{ recommendation.title }}</text>
      <text class="recommend-desc">{{ recommendation.description }}</text>
      <view class="recommend-tags">
        <Tag 
          v-for="tag in recommendation.tags" 
          :key="tag" 
          :text="tag" 
          size="small" 
        />
      </view>
    </Card>

    <!-- 开始学习按钮 -->
    <view class="action-area">
      <view class="start-btn" @click="startLearning">
        <text class="btn-text">开始学习</text>
      </view>
    </view>

    <!-- 历史推荐 -->
    <SectionHeader title="历史推荐" />
    <view class="history-list">
      <view 
        v-for="item in historyList" 
        :key="item.id"
        class="history-item"
        @click="viewHistory(item)"
      >
        <view class="history-date">
          <text class="date-day">{{ getDay(item.date) }}</text>
          <text class="date-month">{{ getMonth(item.date) }}月</text>
        </view>
        <view class="history-content">
          <text class="history-title">{{ item.title }}</text>
          <view class="history-tags">
            <Tag 
              v-for="tag in item.tags.slice(0, 2)" 
              :key="tag" 
              :text="tag" 
              size="small" 
            />
          </view>
        </view>
        <text class="history-arrow">&#xe6f8;</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 每日推荐详情页面
 */
import { ref } from 'vue';
import { dailyRecommendations, difficultyConfig } from '@/data/mockData';
import type { DailyRecommendation } from '@/types';
import Card from '@/components/Card.vue';
import Tag from '@/components/Tag.vue';
import SectionHeader from '@/components/SectionHeader.vue';

// 当前推荐
const recommendation = ref(dailyRecommendations[0]);

// 历史推荐（除当前外）
const historyList = ref(dailyRecommendations.slice(1));

// 获取日期中的日
const getDay = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.getDate().toString().padStart(2, '0');
};

// 获取日期中的月
const getMonth = (dateStr: string): string => {
  const date = new Date(dateStr);
  return (date.getMonth() + 1).toString();
};

// 开始学习
const startLearning = () => {
  uni.navigateTo({
    url: `/pages/sub-pages/question-detail?id=${recommendation.value.questionId}`,
  });
};

// 查看历史推荐
const viewHistory = (item: DailyRecommendation) => {
  uni.navigateTo({
    url: `/pages/sub-pages/question-detail?id=${item.questionId}`,
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

// 日期头部
.date-header {
  @include flex-row;
  justify-content: center;
  margin-bottom: $spacing-xl;
}

.date-icon {
  font-size: $font-lg;
  margin-right: $spacing-sm;
}

.date-text {
  font-size: $font-lg;
  font-weight: 500;
  color: $text-primary;
}

// 推荐卡片
.recommend-card {
  margin-bottom: $spacing-xl;
}

.card-header {
  @include flex-row;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.recommend-title {
  font-size: $font-xl;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: $spacing-md;
  display: block;
}

.recommend-desc {
  font-size: $font-md;
  color: $text-secondary;
  line-height: 1.5;
  margin-bottom: $spacing-lg;
  display: block;
}

.recommend-tags {
  @include flex-row;
  gap: $spacing-sm;
}

// 操作区域
.action-area {
  margin-bottom: $spacing-xxl;
}

.start-btn {
  background: linear-gradient(135deg, $primary, $primary-light);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  @include flex-center;
}

.btn-text {
  font-size: $font-lg;
  font-weight: 600;
  color: #FFFFFF;
}

// 历史推荐
.history-list {
  @include flex-column;
  gap: $spacing-md;
}

.history-item {
  @include flex-row;
  background-color: $card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  @include card-shadow;
}

.history-date {
  @include flex-column;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  height: 100rpx;
  background-color: $primary-bg;
  border-radius: $radius-md;
  margin-right: $spacing-lg;
  flex-shrink: 0;
}

.date-day {
  font-size: $font-xl;
  font-weight: 700;
  color: $primary;
}

.date-month {
  font-size: $font-xs;
  color: $text-secondary;
}

.history-content {
  flex: 1;
  @include flex-column;
  justify-content: center;
}

.history-title {
  font-size: $font-md;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: $spacing-xs;
  @include text-ellipsis;
}

.history-tags {
  @include flex-row;
  gap: $spacing-sm;
}

.history-arrow {
  font-family: 'uniicons';
  font-size: $font-md;
  color: $text-muted;
  margin-left: $spacing-md;
}
</style>
