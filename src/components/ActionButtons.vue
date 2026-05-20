<template>
  <!-- 操作按钮组组件 -->
  <view class="action-buttons">
    <!-- 推荐按钮 -->
    <view class="action-btn" @click="handleRecommend">
      <text class="btn-icon">&#xe6a0;</text>
      <text class="btn-text">推荐 {{ recommends }}</text>
    </view>
    
    <!-- 收藏按钮 -->
    <view class="action-btn" @click="handleFavorite">
      <text class="btn-icon" :class="{ favorite: isFavorited }">&#xe600;</text>
      <text class="btn-text" :class="{ favorite: isFavorited }">
        {{ isFavorited ? '已收藏' : '收藏' }}
      </text>
    </view>
    
    <!-- 分享按钮 -->
    <view class="action-btn" @click="handleShare">
      <text class="btn-icon">&#xe6a4;</text>
      <text class="btn-text">分享</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 操作按钮组组件
 * 三个按钮：推荐(数字)、收藏(可切换❤️)、分享
 */

interface Props {
  /** 推荐数 */
  recommends: number;
  /** 是否已收藏 */
  isFavorited: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** 推荐点击事件 */
  (e: 'recommend'): void;
  /** 收藏点击事件 */
  (e: 'favorite'): void;
  /** 分享点击事件 */
  (e: 'share'): void;
}>();

// 处理推荐点击
const handleRecommend = () => {
  emit('recommend');
};

// 处理收藏点击
const handleFavorite = () => {
  emit('favorite');
};

// 处理分享点击
const handleShare = () => {
  emit('share');
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.action-buttons {
  @include flex-row;
  justify-content: space-around;
  padding: $spacing-lg 0;
  border-top: 1rpx solid $border;
  border-bottom: 1rpx solid $border;
}

.action-btn {
  @include flex-column;
  align-items: center;
  justify-content: center;
  padding: $spacing-sm $spacing-lg;
}

.btn-icon {
  font-family: 'uniicons';
  font-size: 40rpx;
  color: $text-secondary;
  margin-bottom: 4rpx;
}

.btn-icon.favorite {
  color: $danger;
}

.btn-text {
  font-size: $font-xs;
  color: $text-secondary;
}

.btn-text.favorite {
  color: $danger;
}
</style>
