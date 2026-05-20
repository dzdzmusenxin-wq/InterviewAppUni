<template>
  <!-- 收藏页面 -->
  <view class="page-container">
    <!-- 收藏分类 -->
    <view class="category-bar">
      <view 
        v-for="cat in categories" 
        :key="cat.value"
        class="category-item"
        :class="{ active: currentCategory === cat.value }"
        @click="setCategory(cat.value)"
      >
        <text class="category-text">{{ cat.label }}</text>
      </view>
    </view>

    <!-- 收藏列表 -->
    <view class="favorite-list">
      <view 
        v-for="item in filteredFavorites" 
        :key="item.id"
        class="favorite-item"
        @click="goToDetail(item)"
      >
        <view class="item-header">
          <view class="item-tags">
            <Tag 
              v-for="tag in item.tags.slice(0, 2)" 
              :key="tag" 
              :text="tag" 
              size="small" 
            />
          </view>
          <Tag 
            :text="difficultyConfig[item.difficulty].label" 
            :variant="item.difficulty" 
            size="small" 
          />
        </view>
        <text class="item-title">{{ item.title }}</text>
        <view class="item-footer">
          <text class="favorite-date">收藏于 {{ item.favoriteDate }}</text>
          <view class="item-actions">
            <text class="action-icon" @click.stop="removeFavorite(item)">&#xe6e1;</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="filteredFavorites.length === 0" class="empty-state">
      <text class="empty-icon">⭐</text>
      <text class="empty-text">暂无收藏</text>
      <text class="empty-subtext">遇到好题目就收藏起来吧</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 收藏页面
 */
import { ref, computed } from 'vue';
import { questions, difficultyConfig } from '@/data/mockData';
import type { Question, TechModule } from '@/types';
import Tag from '@/components/Tag.vue';

// 收藏分类
const categories = [
  { label: '全部', value: 'all' },
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
];

// 当前分类
const currentCategory = ref('all');

// 收藏数据（模拟）
const favoriteItems = ref([
  {
    ...questions[0],
    favoriteDate: '2024-01-15',
  },
]);

// 筛选后的收藏列表
const filteredFavorites = computed(() => {
  if (currentCategory.value === 'all') {
    return favoriteItems.value;
  }
  return favoriteItems.value.filter(item => item.module === currentCategory.value);
});

// 设置分类
const setCategory = (value: string) => {
  currentCategory.value = value;
};

// 跳转到详情
const goToDetail = (item: typeof favoriteItems.value[0]) => {
  uni.navigateTo({
    url: `/pages/sub-pages/question-detail?id=${item.id}`,
  });
};

// 取消收藏
const removeFavorite = (item: typeof favoriteItems.value[0]) => {
  uni.showModal({
    title: '提示',
    content: '确定取消收藏吗？',
    success: (res) => {
      if (res.confirm) {
        favoriteItems.value = favoriteItems.value.filter(i => i.id !== item.id);
        uni.showToast({ title: '已取消收藏', icon: 'success' });
      }
    },
  });
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background-color: $bg;
  padding: $spacing-lg;
  padding-bottom: calc($spacing-lg + constant(safe-area-inset-bottom));
  padding-bottom: calc($spacing-lg + env(safe-area-inset-bottom));
}

// 分类栏
.category-bar {
  @include flex-row;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  overflow-x: auto;
}

.category-item {
  padding: $spacing-md $spacing-lg;
  background-color: $card;
  border-radius: $radius-full;
  border: 2rpx solid $border;
  flex-shrink: 0;
}

.category-item.active {
  background-color: $warning;
  border-color: $warning;
}

.category-text {
  font-size: $font-md;
  color: $text-secondary;
  white-space: nowrap;
}

.category-item.active .category-text {
  color: #FFFFFF;
}

// 收藏列表
.favorite-list {
  @include flex-column;
  gap: $spacing-md;
}

.favorite-item {
  background-color: $card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  @include card-shadow;
}

.item-header {
  @include flex-row;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.item-tags {
  @include flex-row;
  gap: $spacing-sm;
}

.item-title {
  font-size: $font-md;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: $spacing-md;
  display: block;
}

.item-footer {
  @include flex-row;
  justify-content: space-between;
}

.favorite-date {
  font-size: $font-sm;
  color: $text-muted;
}

.item-actions {
  @include flex-row;
  gap: $spacing-md;
}

.action-icon {
  font-family: 'uniicons';
  font-size: $font-md;
  color: $text-muted;
  padding: $spacing-sm;
}

// 空状态
.empty-state {
  @include flex-column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xxl * 3;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: $spacing-lg;
}

.empty-text {
  font-size: $font-lg;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.empty-subtext {
  font-size: $font-md;
  color: $text-secondary;
}
</style>
