<template>
  <!-- 开关项组件 -->
  <view class="switch-item">
    <view class="item-content">
      <text class="item-label">{{ label }}</text>
      <text v-if="description" class="item-description">{{ description }}</text>
    </view>
    <switch
      :checked="modelValue"
      :color="switchColor"
      @change="handleChange"
    />
  </view>
</template>

<script setup lang="ts">
/**
 * 开关项组件
 * 左侧标签和描述，右侧switch组件
 */

interface Props {
  /** 标签 */
  label: string;
  /** 描述（可选） */
  description?: string;
  /** 开关状态 */
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** 更新开关状态 */
  (e: 'update:modelValue', value: boolean): void;
}>();

// 开关颜色
const switchColor = '#4F46E5';

// 处理开关变化
const handleChange = (e: any) => {
  emit('update:modelValue', e.detail.value);
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.switch-item {
  @include flex-row;
  justify-content: space-between;
  padding: $spacing-lg 0;
  border-bottom: 1rpx solid $border;
  
  &:last-child {
    border-bottom: none;
  }
}

.item-content {
  @include flex-column;
  flex: 1;
  margin-right: $spacing-lg;
}

.item-label {
  font-size: $font-md;
  color: $text-primary;
}

.item-description {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: 4rpx;
}
</style>
