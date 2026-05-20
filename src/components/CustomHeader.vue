<template>
  <!-- 通用导航头部组件 -->
  <view class="custom-header">
    <view class="header-left" @click="handleBack">
      <text v-if="showBack" class="back-icon">&#xe679;</text>
    </view>
    <view class="header-center">
      <text class="header-title">{{ title }}</text>
      <text v-if="subtitle" class="header-subtitle">{{ subtitle }}</text>
    </view>
    <view class="header-right" @click="handleRightClick">
      <text v-if="rightText" class="right-text">{{ rightText }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 通用导航头部组件
 * 白色背景，底部1px边框，左侧返回箭头，中间标题+副标题
 */

interface Props {
  /** 标题 */
  title: string;
  /** 副标题（可选） */
  subtitle?: string;
  /** 是否显示返回按钮，默认为true */
  showBack?: boolean;
  /** 右侧文字（可选） */
  rightText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showBack: true,
});

const emit = defineEmits<{
  /** 右侧点击事件 */
  (e: 'rightClick'): void;
}>();

// 处理返回按钮点击
const handleBack = () => {
  if (props.showBack) {
    uni.navigateBack();
  }
};

// 处理右侧点击
const handleRightClick = () => {
  emit('rightClick');
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.custom-header {
  @include flex-row;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 $spacing-lg;
  background-color: $card;
  border-bottom: 1rpx solid $border;
  box-sizing: border-box;
}

.header-left {
  width: 100rpx;
  @include flex-row;
}

.back-icon {
  font-family: 'uniicons';
  font-size: $font-xl;
  color: $text-primary;
}

.header-center {
  flex: 1;
  @include flex-column;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
}

.header-subtitle {
  font-size: $font-xs;
  color: $text-secondary;
  margin-top: 4rpx;
}

.header-right {
  width: 100rpx;
  @include flex-row;
  justify-content: flex-end;
}

.right-text {
  font-size: $font-md;
  color: $primary;
}
</style>
