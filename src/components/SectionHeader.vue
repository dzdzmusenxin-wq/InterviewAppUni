<template>
  <!-- 区块标题组件 -->
  <view class="section-header">
    <text class="section-title">{{ title }}</text>
    <view v-if="rightText" class="section-right" @click="handleRightClick">
      <text class="right-text">{{ rightText }}</text>
      <text class="arrow-icon">&#xe6f8;</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 区块标题组件
 * 左侧标题，右侧可选文字+箭头
 */

interface Props {
  /** 标题 */
  title: string;
  /** 右侧文字（可选） */
  rightText?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** 右侧点击事件 */
  (e: 'rightClick'): void;
}>();

// 处理右侧点击
const handleRightClick = () => {
  emit('rightClick');
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.section-header {
  @include flex-row;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
}

.section-title {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
}

.section-right {
  @include flex-row;
}

.right-text {
  font-size: $font-sm;
  color: $text-secondary;
}

.arrow-icon {
  font-family: 'uniicons';
  font-size: $font-sm;
  color: $text-secondary;
  margin-left: 4rpx;
}
</style>
