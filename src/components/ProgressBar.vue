<template>
  <!-- 进度条组件 -->
  <view class="progress-bar">
    <view 
      class="progress-track"
      :style="{ height: height + 'rpx' }"
    >
      <view 
        class="progress-fill"
        :style="fillStyle"
      />
    </view>
    <text v-if="showPercent" class="progress-text">{{ Math.round(progress * 100) }}%</text>
  </view>
</template>

<script setup lang="ts">
/**
 * 进度条组件
 * 支持自定义进度、颜色、高度
 */
import { computed } from 'vue';

interface Props {
  /** 进度值 0-1 */
  progress: number;
  /** 进度条颜色 */
  color?: string;
  /** 进度条高度（rpx） */
  height?: number;
  /** 是否显示百分比 */
  showPercent?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: '#4F46E5',
  height: 8,
  showPercent: false,
});

// 填充样式
const fillStyle = computed(() => {
  const validProgress = Math.max(0, Math.min(1, props.progress));
  return {
    width: `${validProgress * 100}%`,
    backgroundColor: props.color,
  };
});
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.progress-bar {
  @include flex-row;
  gap: $spacing-md;
}

.progress-track {
  flex: 1;
  background-color: $border;
  border-radius: $radius-full;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: $radius-full;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: $font-sm;
  color: $text-secondary;
  min-width: 60rpx;
  text-align: right;
}
</style>
