<template>
  <view class="page-container">
    <view class="header">
      <text class="title">Supabase 数据测试</text>
    </view>

    <view class="section">
      <text class="section-title">分类统计</text>
      <view v-for="cat in categories" :key="cat.id" class="category-item">
        <text class="category-icon">{{ cat.icon }}</text>
        <view class="category-info">
          <text class="category-name">{{ cat.name }}</text>
          <text class="category-count">{{ cat.count }} 题</text>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">推荐题目</text>
      <view v-for="q in recommendedQuestions" :key="q.id" class="question-item">
        <text class="question-content">{{ q.content }}</text>
        <view class="question-tags">
          <text class="tag" v-if="q.is_recommended">推荐</text>
          <text class="tag category">{{ q.category }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllCategoriesFromQuestions, getRecommendedQuestions } from '@/utils/supabase';

const categories = ref<any[]>([]);
const recommendedQuestions = ref<any[]>([]);

onMounted(async () => {
  try {
    // 加载分类
    categories.value = await getAllCategoriesFromQuestions();
    console.log('分类数据:', categories.value);

    // 加载推荐题目
    recommendedQuestions.value = await getRecommendedQuestions();
    console.log('推荐题目:', recommendedQuestions.value);
  } catch (error) {
    console.error('加载数据失败:', error);
  }
});
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.header {
  padding: 40rpx 20rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20rpx;
  margin-bottom: 30rpx;
}

.title {
  font-size: 40rpx;
  font-weight: 600;
  color: #ffffff;
}

.section {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.category-item:last-child {
  border-bottom: none;
}

.category-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.category-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-name {
  font-size: 28rpx;
  color: #333;
}

.category-count {
  font-size: 24rpx;
  color: #999;
}

.question-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.question-item:last-child {
  border-bottom: none;
}

.question-content {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.question-tags {
  display: flex;
  gap: 10rpx;
}

.tag {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  background-color: #667eea;
  color: #ffffff;
}

.tag.category {
  background-color: #f093fb;
}
</style>
