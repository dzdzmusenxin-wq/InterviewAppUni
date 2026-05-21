<template>
  <view class="page-container">
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 错误提示 -->
    <view v-else-if="error" class="error-container">
      <text class="error-icon">❌</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <!-- 问题内容 -->
    <template v-else-if="question">
      <!-- 问题卡片 -->
      <Card class="question-card">
        <view class="question-header">
          <view class="question-tags">
            <Tag 
              v-for="tag in question.tags.slice(0, 2)" 
              :key="tag" 
              :text="tag" 
              size="small" 
            />
          </view>
          <view class="category-badge">
            <text class="category-text">{{ question.category }}</text>
          </view>
        </view>
        <text class="question-title">{{ question.content }}</text>
        <view class="question-meta">
          <text class="meta-item">📅 {{ formatDate(question.created_at) }}</text>
        </view>
      </Card>

      <!-- 操作按钮 -->
      <ActionButtons
        :recommends="question.likes || 0"
        :is-favorited="isFavorited"
        @recommend="handleRecommend"
        @favorite="handleFavorite"
        @share="handleShare"
      />

      <!-- 熟练度选择 -->
      <Card class="proficiency-card">
        <text class="card-title">掌握程度</text>
        <ProficiencySelector v-model="currentProficiency" />
      </Card>

      <!-- 回答区域 -->
      <CollapsibleSection
        title="回答"
        icon="💡"
        icon-bg-color="#FEF3C7"
        default-open="true"
        class="answer-section"
      >
        <view v-if="question && question.answer" class="text-content">
          <text class="content-text">{{ question.answer }}</text>
        </view>
        <view v-else class="empty-content">
          <text>暂无回答内容</text>
        </view>
      </CollapsibleSection>

      <!-- 实际应用场景 -->
      <CollapsibleSection
        v-if="question && question.scenarios"
        title="实际应用场景"
        icon="📱"
        icon-bg-color="#D1FAE5"
        class="answer-section"
      >
        <view class="text-content">
          <text class="content-text">{{ question.scenarios }}</text>
        </view>
      </CollapsibleSection>

      <!-- 代码示例 -->
      <CollapsibleSection
        v-if="question && question.code_example"
        title="代码示例"
        icon="💻"
        icon-bg-color="#EEF2FF"
        class="answer-section"
      >
        <view class="code-block">
          <text class="code-text">{{ question.code_example }}</text>
        </view>
      </CollapsibleSection>

      <!-- 深入理解 -->
      <CollapsibleSection
        v-if="question && question.advanced"
        title="深入理解"
        icon="📈"
        icon-bg-color="#F3E8FF"
        class="answer-section"
      >
        <view class="text-content">
          <text class="content-text">{{ question.advanced }}</text>
        </view>
      </CollapsibleSection>

      <!-- 注意事项 -->
      <CollapsibleSection
        v-if="question && question.notes"
        title="注意事项"
        icon="⚠️"
        icon-bg-color="#FEE2E2"
        class="answer-section"
      >
        <view class="text-content">
          <text class="content-text">{{ question.notes }}</text>
        </view>
      </CollapsibleSection>

      <!-- 追问 -->
      <Card v-if="followUpQuestions.length > 0" class="followup-card">
        <text class="card-title">相关追问</text>
        <view 
          v-for="(followUp, index) in followUpQuestions" 
          :key="index"
          class="followup-item"
          @click="goToQuestion(followUp.id)"
        >
          <view class="followup-q">
            <text class="q-label">Q:</text>
            <text class="q-text">{{ followUp.content }}</text>
          </view>
        </view>
      </Card>
    </template>

    <!-- 空状态提示 -->
    <view v-else class="empty-container">
      <text class="empty-icon">📭</text>
      <text class="empty-text">{{ errorMessage || '问题不存在' }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 题目详情页面 - 从数据库读取数据
 */
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import type { Proficiency } from '@/types';
import { getQuestionById, getQuestionsByParentId } from '@/utils/supabase';
import Card from '@/components/Card.vue';
import Tag from '@/components/Tag.vue';
import ActionButtons from '@/components/ActionButtons.vue';
import ProficiencySelector from '@/components/ProficiencySelector.vue';
import CollapsibleSection from '@/components/CollapsibleSection.vue';

// 问题数据
const question = ref<any>(null);

// 追问列表
const followUpQuestions = ref<any[]>([]);

// 加载状态
const isLoading = ref(true);

// 错误状态
const error = ref('');

// 错误信息（旧版本兼容）
const errorMessage = ref('');

// 是否收藏
const isFavorited = ref(false);

// 当前熟练度
const currentProficiency = ref<Proficiency>('learning');

// 格式化日期
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

// 处理推荐
const handleRecommend = () => {
  uni.showToast({ title: '已推荐', icon: 'success' });
};

// 处理收藏
const handleFavorite = () => {
  isFavorited.value = !isFavorited.value;
  uni.showToast({ 
    title: isFavorited.value ? '已收藏' : '已取消收藏', 
    icon: 'success' 
  });
};

// 处理分享
const handleShare = () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline'],
  });
};

// 跳转到其他问题
const goToQuestion = (id: string) => {
  uni.redirectTo({
    url: `/pages/sub-pages/question-detail?id=${id}`,
  });
};

// 加载问题数据
const loadQuestion = async (id: string) => {
  isLoading.value = true;
  error.value = '';

  try {
    console.log('[QuestionDetail] 开始加载题目:', id);
    const data = await getQuestionById(id);
    console.log('[QuestionDetail] 获取到数据:', data);

    if (data) {
      question.value = {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : []
      };

      // 加载追问
      const followUps = await getQuestionsByParentId(id);
      followUpQuestions.value = followUps.map(q => ({
        ...q,
        tags: Array.isArray(q.tags) ? q.tags : []
      }));
    } else {
      error.value = '问题不存在';
    }
  } catch (err) {
    console.error('[QuestionDetail] 加载失败:', err);
    error.value = '加载失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
};

onLoad((options) => {
  const questionId = options.id || '1';
  console.log('[QuestionDetail] 页面加载, ID:', questionId);
  loadQuestion(questionId);
});
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

// 加载状态
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.loading-text {
  font-size: $font-md;
  color: $text-muted;
}

// 错误状态
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: $spacing-md;
}

.error-icon {
  font-size: 64rpx;
}

.error-text {
  font-size: $font-md;
  color: $text-muted;
  text-align: center;
}

// 问题卡片
.question-card {
  margin-bottom: $spacing-lg;
}

.question-header {
  @include flex-row;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.question-tags {
  @include flex-row;
  gap: $spacing-sm;
}

.category-badge {
  background-color: rgba($primary, 0.1);
  padding: 8rpx 16rpx;
  border-radius: $radius-sm;
}

.category-text {
  color: $primary;
  font-size: $font-sm;
  font-weight: 500;
}

.question-title {
  font-size: $font-xl;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: $spacing-md;
  display: block;
}

.question-meta {
  @include flex-row;
  gap: $spacing-xl;
}

.meta-item {
  font-size: $font-sm;
  color: $text-muted;
}

// 熟练度卡片
.proficiency-card {
  margin-bottom: $spacing-lg;
}

.card-title {
  font-size: $font-md;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: $spacing-md;
  display: block;
}

// 回答区域
.answer-section {
  margin-bottom: $spacing-md;
}

.text-content {
  line-height: 1.8;
}

.content-text {
  font-size: $font-md;
  color: $text-primary;
  white-space: pre-wrap;
  word-break: break-all;
}

.empty-content {
  text-align: center;
  color: $text-muted;
  padding: $spacing-xl;
}

.code-block {
  background-color: #1E293B;
  border-radius: $radius-md;
  padding: $spacing-lg;
  overflow-x: auto;
}

.code-text {
  font-family: 'Courier New', monospace;
  font-size: $font-sm;
  color: #E2E8F0;
  white-space: pre-wrap;
}

// 追问卡片
.followup-card {
  margin-bottom: $spacing-lg;
}

.followup-item {
  padding: $spacing-lg 0;
  border-bottom: 1rpx solid $border;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &:first-child {
    padding-top: 0;
  }
}

.followup-q {
  @include flex-row;
  align-items: flex-start;
}

.q-label {
  font-size: $font-md;
  font-weight: 600;
  color: $primary;
  margin-right: $spacing-sm;
  flex-shrink: 0;
}

.q-text {
  font-size: $font-md;
  color: $text-primary;
  flex: 1;
}

// 空状态
.empty-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: $spacing-md;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: $spacing-md;
}

.empty-text {
  font-size: $font-md;
  color: $text-muted;
}
</style>
