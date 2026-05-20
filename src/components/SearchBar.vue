<template>
  <!-- 搜索栏组件 -->
  <view class="search-bar">
    <view class="search-wrapper">
      <text class="search-icon">&#xe6a8;</text>
      <input
        :value="modelValue"
        class="search-input"
        :placeholder="placeholder"
        confirm-type="search"
        @input="handleInput"
        @confirm="handleConfirm"
      />
      <text 
        v-if="modelValue" 
        class="clear-icon"
        @click="handleClear"
      >&#xe6e1;</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 搜索栏组件
 * v-model 双向绑定
 */

interface Props {
  /** 输入值 */
  modelValue: string;
  /** 占位提示文字 */
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索题目、知识点...',
});

const emit = defineEmits<{
  /** 更新输入值 */
  (e: 'update:modelValue', value: string): void;
  /** 确认搜索 */
  (e: 'confirm', value: string): void;
}>();

// 处理输入
const handleInput = (e: any) => {
  emit('update:modelValue', e.detail.value);
};

// 处理确认
const handleConfirm = () => {
  emit('confirm', props.modelValue);
};

// 处理清空
const handleClear = () => {
  emit('update:modelValue', '');
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.search-bar {
  padding: $spacing-lg;
}

.search-wrapper {
  @include flex-row;
  height: 80rpx;
  padding: 0 $spacing-lg;
  background-color: $card;
  border-radius: $radius-full;
  border: 1rpx solid $border;
}

.search-icon {
  font-family: 'uniicons';
  font-size: $font-lg;
  color: $text-muted;
  margin-right: $spacing-md;
}

.search-input {
  flex: 1;
  font-size: $font-md;
  color: $text-primary;
}

.clear-icon {
  font-family: 'uniicons';
  font-size: $font-md;
  color: $text-muted;
  padding: $spacing-sm;
}
</style>
