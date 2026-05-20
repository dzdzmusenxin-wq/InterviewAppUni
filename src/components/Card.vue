<template>
  <!-- 通用卡片组件 -->
  <view 
    class="card-container"
    :style="cardStyle"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
/**
 * 通用卡片组件
 * 支持自定义内边距、阴影、圆角、背景色
 */
import { computed } from 'vue';

interface Props {
  /** 内边距，默认24rpx */
  padding?: string | number;
  /** 是否显示阴影，默认true */
  shadow?: boolean;
  /** 圆角大小，默认16rpx */
  radius?: string | number;
  /** 背景颜色，默认白色 */
  bgColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  padding: '24rpx',
  shadow: true,
  radius: '16rpx',
  bgColor: '#FFFFFF',
});

// 计算卡片样式
const cardStyle = computed(() => {
  return {
    padding: typeof props.padding === 'number' ? `${props.padding}rpx` : props.padding,
    borderRadius: typeof props.radius === 'number' ? `${props.radius}rpx` : props.radius,
    backgroundColor: props.bgColor,
    boxShadow: props.shadow ? '0 2rpx 8rpx rgba(0, 0, 0, 0.04)' : 'none',
  };
});
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.card-container {
  box-sizing: border-box;
}
</style>
