<template>
  <!-- 熟练度选择器组件 -->
  <view class="proficiency-selector">
    <view 
      v-for="option in options" 
      :key="option.value"
      class="proficiency-btn"
      :class="{ active: modelValue === option.value }"
      :style="getBtnStyle(option.value)"
      @click="selectProficiency(option.value)"
    >
      <text class="btn-text">{{ option.label }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 熟练度选择器组件
 * 4按钮横排：未掌握/了解/熟练/精通
 */
import type { Proficiency } from '@/types';
import { proficiencyConfig } from '@/data/mockData';

interface Props {
  /** 当前选中的熟练度 */
  modelValue: Proficiency;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** 更新选中的熟练度 */
  (e: 'update:modelValue', value: Proficiency): void;
}>();

// 选项配置
const options: { value: Proficiency; label: string }[] = [
  { value: 'none', label: '未掌握' },
  { value: 'basic', label: '了解' },
  { value: 'proficient', label: '熟练' },
  { value: 'expert', label: '精通' },
];

// 获取按钮样式
const getBtnStyle = (value: Proficiency) => {
  const isActive = props.modelValue === value;
  const config = proficiencyConfig[value];
  
  if (isActive) {
    return {
      backgroundColor: config.color,
      borderColor: config.color,
    };
  }
  return {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  };
};

// 选择熟练度
const selectProficiency = (value: Proficiency) => {
  emit('update:modelValue', value);
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.proficiency-selector {
  @include flex-row;
  justify-content: space-between;
  gap: $spacing-md;
}

.proficiency-btn {
  flex: 1;
  height: 64rpx;
  border-radius: $radius-md;
  border: 2rpx solid $border;
  @include flex-center;
  transition: all 0.2s ease;
}

.btn-text {
  font-size: $font-sm;
  color: $text-secondary;
}

.proficiency-btn.active .btn-text {
  color: #FFFFFF;
  font-weight: 500;
}
</style>
