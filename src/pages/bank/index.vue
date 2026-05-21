<template>
  <view class="container">
    <view class="header">
      <view class="header-title">题库中心</view>
      <view class="header-subtitle">共 {{ totalCount }} 道题目</view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          placeholder="搜索题目..."
          v-model="searchText"
          @input="handleSearch"
        />
      </view>
    </view>

    <view class="category-tabs">
      <scroll-view scroll-x class="tabs-scroll">
        <view
          class="tab-item"
          :class="{ active: currentCategory === '' }"
          @click="selectCategory('')"
        >
          全部
        </view>
        <view
          v-for="category in categories"
          :key="category.id"
          class="tab-item"
          :class="{ active: currentCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </view>
      </scroll-view>
    </view>

    <view class="question-list">
      <view
        v-for="question in filteredQuestions"
        :key="question.id"
        class="question-card"
        @click="goToDetail(question)"
      >
        <view class="question-header">
          <view class="question-category">{{ getCategoryName(question.categoryId) }}</view>
          <view class="question-difficulty" :class="question.difficulty">
            {{ getDifficultyLabel(question.difficulty) }}
          </view>
        </view>
        <view class="question-content">{{ question.content }}</view>
        <view class="question-footer">
          <view class="question-tags">
            <text
              v-for="tag in question.tags.slice(0, 3)"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </text>
          </view>
          <text class="arrow">→</text>
        </view>
      </view>

      <view v-if="filteredQuestions.length === 0" class="empty-state">
        <text class="empty-icon">📚</text>
        <text class="empty-text">暂无题目</text>
      </view>
    </view>

    <view class="import-btn-wrap">
      <button class="import-btn" @click="handleImport">
        📥 导入题库
      </button>
      <view class="btn-row">
        <button class="db-path-btn" @click="showDatabasePath">
          📁 路径
        </button>
        <button class="export-btn" @click="exportDatabase">
          💾 导出
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { QuestionBankItem, QuestionCategory } from '@/types';
import { questionBankService } from '@/services/questionBankService';

const searchText = ref('');
const currentCategory = ref('');
const questions = ref<QuestionBankItem[]>([]);
const categories = ref<QuestionCategory[]>([]);
const isLoading = ref(false);

const totalCount = computed(() => questions.value.length);

const filteredQuestions = computed(() => {
  let result = questions.value;

  if (currentCategory.value) {
    result = result.filter(q => q.categoryId === currentCategory.value);
  }

  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter(q =>
      q.content.toLowerCase().includes(keyword) ||
      q.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
  }

  return result;
});

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

const selectCategory = (categoryId: string) => {
  currentCategory.value = categoryId;
};

const goToDetail = (question: QuestionBankItem) => {
  uni.navigateTo({
    url: '/pages/sub-pages/bank-detail?id=' + question.id
  });
};

const handleSearch = async () => {
  if (searchText.value) {
    await questionBankService.addSearchHistory(searchText.value);
  }
};

const handleImport = async () => {
  isLoading.value = true;
  try {
    const result = await questionBankService.importSampleData();
    if (result.success) {
      uni.showToast({
        title: result.message,
        icon: 'success',
        duration: 2000
      });
      await loadData();
    } else {
      uni.showToast({
        title: result.message,
        icon: 'none'
      });
    }
  } catch (e) {
    console.error('Import error:', e);
    uni.showToast({
      title: '导入失败',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
  }
};

const showDatabasePath = () => {
  const path = questionBankService.getDatabasePath();
  uni.showModal({
    title: '数据库路径',
    content: path,
    showCancel: false,
    confirmText: '确定'
  });
};

const exportDatabase = async () => {
  isLoading.value = true;
  try {
    const data = await questionBankService.exportData();
    const jsonStr = JSON.stringify(data, null, 2);
    
    console.log('========== 数据库内容 ==========');
    console.log(jsonStr);
    console.log('================================');
    
    uni.showModal({
      title: '数据库内容',
      content: '数据已打印到控制台，请打开开发者工具查看\n\n题目数量: ' + data.questions.length + '\n分类数量: ' + data.categories.length,
      showCancel: false,
      confirmText: '确定'
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('Export error:', errorMessage);
    uni.showToast({
      title: '导出失败: ' + errorMessage,
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
  }
};

const loadData = async () => {
  try {
    await questionBankService.initialize();
    categories.value = await questionBankService.getAllCategories();
    questions.value = await questionBankService.getAllQuestions();
    console.log('题库数据加载完成，题目数:', questions.value.length);
  } catch (e) {
    console.error('Load data error:', e);
  }
};

onMounted(() => {
  loadData();
});
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #F5F7FA;
  padding-bottom: 120rpx;
}

.header {
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  padding: 60rpx 32rpx 40rpx;
  color: #FFFFFF;
}

.header-title {
  font-size: 44rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.header-subtitle {
  font-size: 28rpx;
  opacity: 0.8;
}

.search-bar {
  padding: 24rpx 32rpx;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 40rpx;
  padding: 0 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.search-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.search-input {
  flex: 1;
  height: 80rpx;
  font-size: 28rpx;
}

.category-tabs {
  padding: 0 32rpx;
  margin-bottom: 24rpx;
}

.tabs-scroll {
  white-space: nowrap;
}

.tab-item {
  display: inline-block;
  padding: 16rpx 32rpx;
  margin-right: 20rpx;
  background-color: #FFFFFF;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: #64748B;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

  &.active {
    background-color: #4F46E5;
    color: #FFFFFF;
  }
}

.question-list {
  padding: 0 32rpx;
}

.question-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.question-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.question-category {
  background-color: #E0E7FF;
  color: #4F46E5;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  margin-right: 12rpx;
}

.question-difficulty {
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;

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
  font-size: 30rpx;
  color: #1E293B;
  line-height: 1.6;
  margin-bottom: 20rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.question-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.question-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag {
  background-color: #F1F5F9;
  color: #64748B;
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
  font-size: 22rpx;
}

.arrow {
  font-size: 32rpx;
  color: #94A3B8;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #94A3B8;
}

.import-btn-wrap {
  position: fixed;
  bottom: 40rpx;
  left: 32rpx;
  right: 32rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.import-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  color: #FFFFFF;
  font-size: 32rpx;
  border-radius: 48rpx;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(79, 70, 229, 0.3);
  margin-bottom: 20rpx;

  &::after {
    border: none;
  }
}

.btn-row {
  display: flex;
  gap: 20rpx;
}

.db-path-btn,
.export-btn {
  flex: 1;
  height: 80rpx;
  background: #FFFFFF;
  color: #4F46E5;
  font-size: 28rpx;
  border-radius: 40rpx;
  border: 2rpx solid #E0E7FF;
  box-shadow: 0 4rpx 12rpx rgba(79, 70, 229, 0.1);

  &::after {
    border: none;
  }
}
</style>
