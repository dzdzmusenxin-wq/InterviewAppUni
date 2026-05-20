<template>
  <!-- 标签组件 -->
  <view 
    class="tag"
    :class="[sizeClass, variantClass]"
    :style="tagStyle"
  >
    <text class="tag-text">{{ text }}</text>
  </view>
</template>

<script setup lang="ts">
/**
 * 标签组件
 * 支持多种变体和尺寸
 */
import { computed } from 'vue';

interface Props {
  /** 标签文字 */
  text: string;
  /** 变体类型 */
  variant?: 'default' | 'hot' | 'new' | 'easy' | 'medium' | 'hard';
  /** 尺寸 */
  size?: 'small' | 'medium';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'medium',
});

// 尺寸类名
const sizeClass = computed(() => `tag-${props.size}`);

// 变体类名
const variantClass = computed(() => `tag-${props.variant}`);

// 变体样式配置
const variantStyles: Record<string, { bg: string; color: string }> = {
  default: { bg: '#EEF2FF', color: '#4F46E5' },
  hot: { bg: '#FEE2E2', color: '#EF4444' },
  new: { bg: '#D1FAE5', color: '#10B981' },
  easy: { bg: '#D1FAE5', color: '#10B981' },
  medium: { bg: '#FEF3C7', color: '#F59E0B' },
  hard: { bg: '#FEE2E2', color: '#EF4444' },
};

// 标签样式
const tagStyle = computed(() => {
  const style = variantStyles[props.variant] || variantStyles.default;
  return {
    backgroundColor: style.bg,
  };
});
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-full;
}

// 尺寸样式
.tag-small {
  padding: 4rpx 12rpx;
  
  .tag-text {
    font-size: $font-xs;
  }
}

.tag-medium {
  padding: 6rpx 16rpx;
  
  .tag-text {
    font-size: $font-sm;
  }
}

// 变体文字颜色
.tag-default .tag-text { color: #4F46E5; }
.tag-hot .tag-text { color: #EF4444; }
.tag-new .tag-text { color: #10B981; }
.tag-easy .tag-text { color: #10B981; }
.tag-medium .tag-text { color: #F59E0B; }
.tag-hard .tag-text { color: #EF4444; }
</style>
