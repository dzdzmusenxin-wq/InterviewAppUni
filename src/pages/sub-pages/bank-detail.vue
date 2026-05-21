<template>
  <view class="container">
    <view v-if="question" class="question-detail">
      <view class="question-header">
        <view class="question-category">{{ getCategoryName(question.categoryId) }}</view>
        <view class="question-difficulty" :class="question.difficulty">
          {{ getDifficultyLabel(question.difficulty) }}
        </view>
      </view>

      <view class="question-content">{{ question.content }}</view>

      <view class="tags-section">
        <text
          v-for="tag in question.tags"
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </text>
      </view>

      <view class="section answer-section">
        <view class="section-title">
          <text class="title-icon">📝</text>
          <text>回答内容</text>
        </view>
        <view class="section-content">{{ question.answer }}</view>
      </view>

      <view v-if="question.notes" class="section notes-section">
        <view class="section-title">
          <text class="title-icon">⚠️</text>
          <text>注意事项</text>
        </view>
        <view class="section-content">{{ question.notes }}</view>
      </view>

      <view v-if="question.advanced" class="section advanced-section">
        <view class="section-title">
          <text class="title-icon">🚀</text>
          <text>进阶理解</text>
        </view>
        <view class="section-content">{{ question.advanced }}</view>
      </view>

      <view v-if="question.scenarios" class="section scenarios-section">
        <view class="section-title">
          <text class="title-icon">💡</text>
          <text>常见应用场景</text>
        </view>
        <view class="section-content">{{ question.scenarios }}</view>
      </view>

      <view class="meta-section">
        <text class="meta-text">创建于 {{ formatDate(question.createdAt) }}</text>
      </view>
    </view>

    <view v-else class="loading-state">
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { QuestionBankItem, QuestionCategory } from '@/types';
import { questionBankService } from '@/services/questionBankService';

const question = ref<QuestionBankItem | null>(null);
const categories = ref<QuestionCategory[]>([]);

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category?.name || '未分类';
};

const getDifficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  };
  return labels[difficulty] || difficulty;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
};

const loadQuestion = async (id: string) => {
  try {
    await questionBankService.initialize();
    categories.value = await questionBankService.getAllCategories();
    question.value = await questionBankService.getQuestionById(id);
  } catch (e) {
    console.error('Load question error:', e);
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
  }
};

onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = (currentPage as any).$page?.options || (currentPage as any).options || {};

  if (options.id) {
    loadQuestion(options.id);
  }
});
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #F5F7FA;
  padding: 24rpx 32rpx;
  padding-bottom: 40rpx;
}

.question-detail {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
}

.question-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.question-category {
  background-color: #E0E7FF;
  color: #4F46E5;
  padding: 8rpx 20rpx;
  border-radius: 10rpx;
  font-size: 24rpx;
  font-weight: 500;
  margin-right: 16rpx;
}

.question-difficulty {
  padding: 8rpx 20rpx;
  border-radius: 10rpx;
  font-size: 24rpx;

  &.easy {
    background-color: #DCFCE7;
    color: #16A34A;
  }

  &.medium {
    background-color: #FEF3C7;
    color: #D97706;
  }

  &.hard {
    background-color: #FECACA;
    color: #DC2626;
  }
}

.question-content {
  font-size: 34rpx;
  color: #1E293B;
  line-height: 1.8;
  margin-bottom: 24rpx;
  font-weight: 600;
}

.tags-section {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.tag {
  background-color: #EEF2FF;
  color: #4F46E5;
  padding: 10rpx 24rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.section {
  margin-bottom: 32rpx;
  padding: 24rpx;
  background-color: #F8FAFC;
  border-radius: 16rpx;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 16rpx;
}

.title-icon {
  margin-right: 12rpx;
  font-size: 32rpx;
}

.section-content {
  font-size: 28rpx;
  color: #475569;
  line-height: 1.8;
  white-space: pre-wrap;
}

.notes-section {
  background-color: #FEF3C7;
}

.notes-section .section-title {
  color: #92400E;
}

.notes-section .section-content {
  color: #78350F;
}

.advanced-section {
  background-color: #EDE9FE;
}

.advanced-section .section-title {
  color: #5B21B6;
}

.advanced-section .section-content {
  color: #4C1D95;
}

.scenarios-section {
  background-color: #D1FAE5;
}

.scenarios-section .section-title {
  color: #065F46;
}

.scenarios-section .section-content {
  color: #064E3B;
}

.meta-section {
  padding-top: 24rpx;
  border-top: 1rpx solid #E2E8F0;
  margin-top: 32rpx;
}

.meta-text {
  font-size: 24rpx;
  color: #94A3B8;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.loading-text {
  font-size: 28rpx;
  color: #94A3B8;
}
</style>