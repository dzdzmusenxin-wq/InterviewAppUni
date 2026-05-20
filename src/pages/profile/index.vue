<template>
  <!-- 我的页面 -->
  <view class="page-container">
    <!-- 渐变头部 -->
    <view class="profile-header">
      <view class="header-bg" />
      <view class="profile-info">
        <view class="avatar-wrapper">
          <image class="avatar" :src="userProfile.avatar" mode="aspectFill" />
        </view>
        <view class="user-info">
          <text class="nickname">{{ userProfile.nickname }}</text>
          <text class="bio">{{ userProfile.bio }}</text>
        </view>
        <view class="edit-btn" @click="goToProfileSettings">
          <text class="edit-text">编辑资料</text>
        </view>
      </view>
      
      <!-- 统计数据 -->
      <view class="stats-row">
        <view class="stat-box">
          <text class="stat-num">{{ userProfile.stats.streakDays }}</text>
          <text class="stat-label">连续学习</text>
        </view>
        <view class="stat-box">
          <text class="stat-num">{{ userProfile.stats.completedQuestions }}</text>
          <text class="stat-label">已完成</text>
        </view>
        <view class="stat-box">
          <text class="stat-num">{{ userProfile.stats.totalStudyTime }}</text>
          <text class="stat-label">学习时长</text>
        </view>
      </view>
    </view>

    <!-- 学习管理 -->
    <view class="section-block">
      <text class="section-title">学习管理</text>
      <view class="menu-list">
        <view class="menu-item" @click="goToErrorBook">
          <view class="menu-left">
            <view class="menu-icon error">
              <text class="icon-text">❌</text>
            </view>
            <text class="menu-text">错题本</text>
          </view>
          <view class="menu-right">
            <text class="menu-badge">{{ userProfile.stats.errorCount }}</text>
            <text class="menu-arrow">&#xe6f8;</text>
          </view>
        </view>
        
        <view class="menu-item" @click="goToFavorites">
          <view class="menu-left">
            <view class="menu-icon favorite">
              <text class="icon-text">⭐</text>
            </view>
            <text class="menu-text">我的收藏</text>
          </view>
          <view class="menu-right">
            <text class="menu-badge">{{ userProfile.stats.favoriteCount }}</text>
            <text class="menu-arrow">&#xe6f8;</text>
          </view>
        </view>
        
        <view class="menu-item" @click="goToCalendar">
          <view class="menu-left">
            <view class="menu-icon calendar">
              <text class="icon-text">📅</text>
            </view>
            <text class="menu-text">学习日历</text>
          </view>
          <view class="menu-right">
            <text class="menu-arrow">&#xe6f8;</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 设置 -->
    <view class="section-block">
      <text class="section-title">设置</text>
      <view class="menu-list">
        <view class="menu-item" @click="goToReminderSettings">
          <view class="menu-left">
            <view class="menu-icon reminder">
              <text class="icon-text">🔔</text>
            </view>
            <text class="menu-text">提醒设置</text>
          </view>
          <view class="menu-right">
            <text class="menu-status">{{ userProfile.reminderEnabled ? '已开启' : '已关闭' }}</text>
            <text class="menu-arrow">&#xe6f8;</text>
          </view>
        </view>
        
        <view class="menu-item" @click="goToGoalSettings">
          <view class="menu-left">
            <view class="menu-icon goal">
              <text class="icon-text">🎯</text>
            </view>
            <text class="menu-text">目标设置</text>
          </view>
          <view class="menu-right">
            <text class="menu-status">{{ userProfile.stats.dailyGoal }}题/天</text>
            <text class="menu-arrow">&#xe6f8;</text>
          </view>
        </view>
        
        <view class="menu-item" @click="goToProfileSettings">
          <view class="menu-left">
            <view class="menu-icon settings">
              <text class="icon-text">⚙️</text>
            </view>
            <text class="menu-text">个人设置</text>
          </view>
          <view class="menu-right">
            <text class="menu-arrow">&#xe6f8;</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 版本信息 -->
    <view class="version-info">
      <text class="version-text">面试通 v1.0.0</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 我的页面
 * 渐变头部、学习管理、设置
 */
import { userProfile } from '@/data/mockData';

// 跳转到错题本
const goToErrorBook = () => {
  uni.navigateTo({
    url: '/pages/sub-pages/error-book',
  });
};

// 跳转到收藏
const goToFavorites = () => {
  uni.navigateTo({
    url: '/pages/sub-pages/favorites',
  });
};

// 跳转到学习日历
const goToCalendar = () => {
  uni.navigateTo({
    url: '/pages/sub-pages/calendar',
  });
};

// 跳转到提醒设置
const goToReminderSettings = () => {
  uni.navigateTo({
    url: '/pages/sub-pages/reminder-settings',
  });
};

// 跳转到目标设置
const goToGoalSettings = () => {
  uni.navigateTo({
    url: '/pages/sub-pages/goal-settings',
  });
};

// 跳转到个人设置
const goToProfileSettings = () => {
  uni.navigateTo({
    url: '/pages/sub-pages/profile-settings',
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

// 渐变头部
.profile-header {
  position: relative;
  padding: $spacing-lg;
  padding-top: calc($spacing-lg + 40rpx);
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400rpx;
  background: linear-gradient(135deg, $primary, $primary-light);
  border-radius: 0 0 40rpx 40rpx;
}

.profile-info {
  position: relative;
  @include flex-row;
  margin-bottom: $spacing-xl;
}

.avatar-wrapper {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid #FFFFFF;
  overflow: hidden;
  margin-right: $spacing-lg;
  flex-shrink: 0;
}

.avatar {
  width: 100%;
  height: 100%;
}

.user-info {
  flex: 1;
  @include flex-column;
  justify-content: center;
}

.nickname {
  font-size: $font-xl;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: $spacing-xs;
}

.bio {
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.8);
}

.edit-btn {
  padding: $spacing-sm $spacing-md;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: $radius-full;
}

.edit-text {
  font-size: $font-sm;
  color: #FFFFFF;
}

// 统计数据
.stats-row {
  position: relative;
  @include flex-row;
  justify-content: space-around;
  background-color: $card;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  @include card-shadow;
}

.stat-box {
  @include flex-column;
  align-items: center;
}

.stat-num {
  font-size: $font-xxl;
  font-weight: 700;
  color: $primary;
}

.stat-label {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: $spacing-xs;
}

// 区块
.section-block {
  padding: $spacing-lg;
  padding-top: $spacing-xxl;
}

.section-title {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;
  display: block;
}

// 菜单列表
.menu-list {
  background-color: $card;
  border-radius: $radius-lg;
  @include card-shadow;
  overflow: hidden;
}

.menu-item {
  @include flex-row;
  justify-content: space-between;
  padding: $spacing-lg $spacing-xl;
  border-bottom: 1rpx solid $border;
  
  &:last-child {
    border-bottom: none;
  }
}

.menu-left {
  @include flex-row;
}

.menu-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: $radius-md;
  @include flex-center;
  margin-right: $spacing-md;
}

.menu-icon.error { background-color: #FEE2E2; }
.menu-icon.favorite { background-color: #FEF3C7; }
.menu-icon.calendar { background-color: #EEF2FF; }
.menu-icon.reminder { background-color: #D1FAE5; }
.menu-icon.goal { background-color: #FEF3C7; }
.menu-icon.settings { background-color: #E2E8F0; }

.icon-text {
  font-size: $font-lg;
}

.menu-text {
  font-size: $font-md;
  color: $text-primary;
}

.menu-right {
  @include flex-row;
}

.menu-badge {
  padding: 2rpx 12rpx;
  background-color: $danger;
  border-radius: $radius-full;
  font-size: $font-xs;
  color: #FFFFFF;
  margin-right: $spacing-sm;
}

.menu-status {
  font-size: $font-sm;
  color: $text-secondary;
  margin-right: $spacing-sm;
}

.menu-arrow {
  font-family: 'uniicons';
  font-size: $font-md;
  color: $text-muted;
}

// 版本信息
.version-info {
  @include flex-center;
  padding: $spacing-xxl;
}

.version-text {
  font-size: $font-sm;
  color: $text-muted;
}
</style>
