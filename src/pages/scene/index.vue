<template>
  <!-- 场景练习页面 -->
  <view class="page-container">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">场景练习</text>
      <text class="page-subtitle">模拟真实面试场景，提升应答能力</text>
    </view>

    <!-- 场景卡片列表 -->
    <view class="scene-list">
      <view 
        v-for="scene in scenes" 
        :key="scene.type"
        class="scene-card"
        @click="goToSceneDetail(scene)"
      >
        <view class="scene-icon-wrapper">
          <text class="scene-icon">{{ getSceneIcon(scene.icon) }}</text>
        </view>
        <view class="scene-content">
          <view class="scene-header">
            <text class="scene-title">{{ scene.title }}</text>
            <view class="scene-badge">
              <text class="badge-text">{{ scene.count }} 题</text>
            </view>
          </view>
          <text class="scene-desc">{{ scene.description }}</text>
        </view>
        <text class="scene-arrow">&#xe6f8;</text>
      </view>
    </view>

    <!-- 练习提示 -->
    <view class="tips-card">
      <view class="tips-header">
        <text class="tips-icon">💡</text>
        <text class="tips-title">练习小贴士</text>
      </view>
      <text class="tips-text">
        建议按照自我介绍 → 项目介绍 → 技术深挖 → HR面试的顺序进行练习，每个场景至少练习3遍以上。
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 场景练习页面
 * 4个场景卡片：自我介绍、项目介绍、技术深挖、HR面试
 */
import { scenes } from '@/data/mockData';
import type { SceneItem } from '@/types';

// 获取场景图标（emoji映射）
const getSceneIcon = (icon: string): string => {
  const iconMap: Record<string, string> = {
    'user': '👤',
    'folder': '📁',
    'code': '💻',
    'message-circle': '💬',
  };
  return iconMap[icon] || '📋';
};

// 跳转到场景详情
const goToSceneDetail = (scene: SceneItem) => {
  uni.navigateTo({
    url: `/pages/sub-pages/scene-detail?type=${scene.type}`,
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
  margin-bottom: $spacing-xxl;
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

// 场景卡片列表
.scene-list {
  @include flex-column;
  gap: $spacing-lg;
  margin-bottom: $spacing-xxl;
}

.scene-card {
  @include flex-row;
  background-color: $card;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  @include card-shadow;
}

.scene-icon-wrapper {
  width: 100rpx;
  height: 100rpx;
  border-radius: $radius-lg;
  background: linear-gradient(135deg, $primary-bg, #FFFFFF);
  @include flex-center;
  margin-right: $spacing-lg;
  flex-shrink: 0;
}

.scene-icon {
  font-size: 48rpx;
}

.scene-content {
  flex: 1;
  @include flex-column;
}

.scene-header {
  @include flex-row;
  justify-content: space-between;
  margin-bottom: $spacing-sm;
}

.scene-title {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
}

.scene-badge {
  padding: 4rpx 16rpx;
  background-color: $primary-bg;
  border-radius: $radius-full;
}

.badge-text {
  font-size: $font-xs;
  color: $primary;
}

.scene-desc {
  font-size: $font-md;
  color: $text-secondary;
  line-height: 1.5;
}

.scene-arrow {
  font-family: 'uniicons';
  font-size: $font-lg;
  color: $text-muted;
  margin-left: $spacing-md;
}

// 练习提示
.tips-card {
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  border-radius: $radius-lg;
  padding: $spacing-xl;
}

.tips-header {
  @include flex-row;
  margin-bottom: $spacing-md;
}

.tips-icon {
  font-size: $font-lg;
  margin-right: $spacing-sm;
}

.tips-title {
  font-size: $font-md;
  font-weight: 600;
  color: $text-primary;
}

.tips-text {
  font-size: $font-md;
  color: $text-secondary;
  line-height: 1.6;
}
</style>
