<template>
  <!-- 首页 -->
  <view class="page-container">
    <!-- 学习进度横幅 -->
    <view class="progress-banner">
      <view class="banner-content">
        <view class="banner-left">
          <text class="banner-title">今日学习进度</text>
          <view class="progress-info">
            <text class="progress-count">{{ userProfile.stats.todayCompleted }}/{{ userProfile.stats.dailyGoal }}</text>
            <text class="progress-label">题</text>
          </view>
          <text class="streak-text">已连续学习 {{ userProfile.stats.streakDays }} 天</text>
        </view>
        <view class="banner-right">
          <view class="progress-ring">
            <text class="ring-percent">{{ Math.round(todayProgress * 100) }}%</text>
          </view>
        </view>
      </view>
      <ProgressBar 
        :progress="todayProgress" 
        :height="12"
        color="#FFFFFF"
        class="banner-progress"
      />
    </view>

    <!-- 技术模块网格 -->
    <SectionHeader title="技术模块" rightText="查看全部" @rightClick="goToQuestionList" />
    <view class="module-grid">
      <view 
        v-for="module in moduleConfig" 
        :key="module.id"
        class="module-card"
        :style="{ borderColor: module.color + '30' }"
        @click="goToModule(module.id)"
      >
        <view class="module-icon-wrapper" :style="{ backgroundColor: module.color + '15' }">
          <text class="module-icon" :style="{ color: module.color }">{{ getModuleIcon(module.icon) }}</text>
        </view>
        <view class="module-info">
          <text class="module-name">{{ module.name }}</text>
          <text class="module-count">{{ module.questionCount }} 题</text>
        </view>
        <text class="module-arrow">&#xe6f8;</text>
      </view>
    </view>

    <!-- 每日推荐 -->
    <SectionHeader title="每日推荐" rightText="更多" @rightClick="goToDailyList" />
    <view 
      v-for="rec in dailyRecommendations.slice(0, 1)" 
      :key="rec.id"
      class="daily-card"
      @click="goToDailyDetail(rec)"
    >
      <view class="daily-header">
        <Tag text="今日推荐" variant="hot" size="small" />
        <text class="daily-date">{{ rec.date }}</text>
      </view>
      <text class="daily-title">{{ rec.title }}</text>
      <text class="daily-desc">{{ rec.description }}</text>
      <view class="daily-footer">
        <view class="daily-tags">
          <Tag 
            v-for="tag in rec.tags.slice(0, 2)" 
            :key="tag" 
            :text="tag" 
            size="small" 
          />
        </view>
        <Tag :text="difficultyConfig[rec.difficulty].label" :variant="rec.difficulty" size="small" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 首页
 * 学习进度横幅、技术模块2x2网格、每日推荐
 */
import { computed } from 'vue';
import { userProfile, moduleConfig, dailyRecommendations, difficultyConfig } from '@/data/mockData';
import type { TechModule } from '@/types';
import SectionHeader from '@/components/SectionHeader.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import Tag from '@/components/Tag.vue';

// 今日学习进度
const todayProgress = computed(() => {
  const { todayCompleted, dailyGoal } = userProfile.stats;
  return Math.min(todayCompleted / dailyGoal, 1);
});

// 获取模块图标（emoji映射）
const getModuleIcon = (icon: string): string => {
  const iconMap: Record<string, string> = {
    javascript: '📜',
    typescript: '🔷',
    react: '⚛️',
    vue: '💚',
  };
  return iconMap[icon] || '📚';
};

// 跳转到题目列表
const goToQuestionList = () => {
  uni.navigateTo({
    url: '/pages/sub-pages/question-list',
  });
};

// 跳转到模块详情
const goToModule = (moduleId: TechModule) => {
  uni.navigateTo({
    url: `/pages/sub-pages/question-list?module=${moduleId}`,
  });
};

// 跳转到每日推荐列表
const goToDailyList = () => {
  uni.navigateTo({
    url: '/pages/sub-pages/daily-detail',
  });
};

// 跳转到每日推荐详情
const goToDailyDetail = (rec: typeof dailyRecommendations[0]) => {
  uni.navigateTo({
    url: `/pages/sub-pages/daily-detail?id=${rec.id}`,
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

// 学习进度横幅
.progress-banner {
  background: linear-gradient(135deg, $primary, $primary-light);
  border-radius: $radius-lg;
  padding: $spacing-xl;
  margin-bottom: $spacing-xxl;
}

.banner-content {
  @include flex-row;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
}

.banner-left {
  @include flex-column;
}

.banner-title {
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: $spacing-sm;
}

.progress-info {
  @include flex-row;
  align-items: baseline;
}

.progress-count {
  font-size: $font-title;
  font-weight: 700;
  color: #FFFFFF;
}

.progress-label {
  font-size: $font-md;
  color: rgba(255, 255, 255, 0.8);
  margin-left: $spacing-sm;
}

.streak-text {
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.8);
  margin-top: $spacing-sm;
}

.banner-right {
  @include flex-center;
}

.progress-ring {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 6rpx solid rgba(255, 255, 255, 0.3);
  @include flex-center;
}

.ring-percent {
  font-size: $font-xl;
  font-weight: 600;
  color: #FFFFFF;
}

.banner-progress {
  :deep(.progress-track) {
    background-color: rgba(255, 255, 255, 0.3);
  }
}

// 技术模块网格
.module-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-xxl;
}

.module-card {
  @include flex-row;
  background-color: $card;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  border: 2rpx solid $border;
  @include card-shadow;
}

.module-icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  border-radius: $radius-md;
  @include flex-center;
  margin-right: $spacing-md;
}

.module-icon {
  font-size: 40rpx;
}

.module-info {
  flex: 1;
  @include flex-column;
}

.module-name {
  font-size: $font-md;
  font-weight: 500;
  color: $text-primary;
}

.module-count {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: 4rpx;
}

.module-arrow {
  font-family: 'uniicons';
  font-size: $font-md;
  color: $text-muted;
}

// 每日推荐卡片
.daily-card {
  background-color: $card;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  @include card-shadow;
}

.daily-header {
  @include flex-row;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.daily-date {
  font-size: $font-sm;
  color: $text-muted;
}

.daily-title {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.daily-desc {
  font-size: $font-md;
  color: $text-secondary;
  line-height: 1.5;
  margin-bottom: $spacing-lg;
}

.daily-footer {
  @include flex-row;
  justify-content: space-between;
}

.daily-tags {
  @include flex-row;
  gap: $spacing-sm;
}
</style>
