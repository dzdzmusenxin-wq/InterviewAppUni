<template>
  <!-- 折叠面板组件 -->
  <view class="collapsible-section">
    <!-- 面板头部 -->
    <view class="section-header-bar" @click="toggle">
      <view class="header-left">
        <view 
          v-if="icon" 
          class="icon-wrapper"
          :style="{ backgroundColor: iconBgColor || '#EEF2FF' }"
        >
          <text class="icon-text">{{ icon }}</text>
        </view>
        <text class="section-title-text">{{ title }}</text>
        <view v-if="badge" class="badge">
          <text class="badge-text">{{ badge }}</text>
        </view>
      </view>
      <view class="header-right">
        <text 
          class="arrow-icon"
          :class="{ 'arrow-rotate': isOpen }"
        >&#xe6b4;</text>
      </view>
    </view>
    
    <!-- 面板内容 -->
    <view 
      class="section-content"
      :style="contentStyle"
    >
      <view class="content-inner">
        <slot />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 折叠面板组件
 * 使用 ref + watch 管理展开状态，uni.createAnimation 实现动画
 */
import { ref, computed, watch } from 'vue';

interface Props {
  /** 标题 */
  title: string;
  /** 图标（可选） */
  icon?: string;
  /** 图标背景色（可选） */
  iconBgColor?: string;
  /** 默认是否展开，默认false */
  defaultOpen?: boolean;
  /** 徽章文字（可选） */
  badge?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
});

// 展开状态
const isOpen = ref(props.defaultOpen);
// 内容高度
const contentHeight = ref(0);

// 内容样式
const contentStyle = computed(() => {
  return {
    height: isOpen.value ? 'auto' : '0',
    opacity: isOpen.value ? 1 : 0,
  };
});

// 监听展开状态变化
watch(isOpen, (newVal) => {
  // 可以在这里添加动画逻辑
});

// 切换展开/折叠
const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.collapsible-section {
  background-color: $card;
  border-radius: $radius-lg;
  overflow: hidden;
  @include card-shadow;
}

.section-header-bar {
  @include flex-row;
  justify-content: space-between;
  padding: $spacing-lg $spacing-xl;
  cursor: pointer;
}

.header-left {
  @include flex-row;
}

.icon-wrapper {
  width: 56rpx;
  height: 56rpx;
  border-radius: $radius-md;
  @include flex-center;
  margin-right: $spacing-md;
}

.icon-text {
  font-size: $font-lg;
}

.section-title-text {
  font-size: $font-md;
  font-weight: 500;
  color: $text-primary;
}

.badge {
  margin-left: $spacing-sm;
  padding: 2rpx 12rpx;
  background-color: $primary-bg;
  border-radius: $radius-full;
}

.badge-text {
  font-size: $font-xs;
  color: $primary;
}

.header-right {
  @include flex-row;
}

.arrow-icon {
  font-family: 'uniicons';
  font-size: $font-md;
  color: $text-secondary;
  transition: transform 0.3s ease;
}

.arrow-rotate {
  transform: rotate(180deg);
}

.section-content {
  overflow: hidden;
  transition: all 0.3s ease;
}

.content-inner {
  padding: 0 $spacing-xl $spacing-xl;
}
</style>
