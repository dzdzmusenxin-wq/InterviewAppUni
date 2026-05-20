<template>
  <!-- 题目详情页面（核心） -->
  <view class="page-container">
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
        <Tag 
          :text="difficultyConfig[question.difficulty].label" 
          :variant="question.difficulty" 
          size="small" 
        />
      </view>
      <text class="question-title">{{ question.title }}</text>
      <text class="question-desc">{{ question.description }}</text>
      <view class="question-meta">
        <text class="meta-item">&#xe6a2; {{ question.views }}</text>
        <text class="meta-item">&#xe6a0; {{ question.likes }}</text>
        <text class="meta-item">&#xe6a8; {{ question.comments }}</text>
      </view>
    </Card>

    <!-- 操作按钮 -->
    <ActionButtons
      :recommends="question.likes"
      :is-favorited="question.isFavorite"
      @recommend="handleRecommend"
      @favorite="handleFavorite"
      @share="handleShare"
    />

    <!-- 熟练度选择 -->
    <Card class="proficiency-card">
      <text class="card-title">掌握程度</text>
      <ProficiencySelector v-model="currentProficiency" />
    </Card>

    <!-- 折叠回答 -->
    <CollapsibleSection
      v-for="(section, index) in question.answerSections"
      :key="index"
      :title="section.heading"
      :icon="getSectionIcon(section.icon)"
      :icon-bg-color="getSectionBgColor(section.icon)"
      :default-open="index === 0"
      class="answer-section"
    >
      <!-- 富文本渲染 -->
      <view class="rich-content">
        <block v-for="(line, lineIndex) in parseContent(section.content)" :key="lineIndex">
          <!-- 代码块 -->
          <view v-if="line.type === 'code'" class="code-block">
            <text class="code-text">{{ line.content }}</text>
          </view>
          <!-- 高亮框 -->
          <view v-else-if="line.type === 'highlight'" class="highlight-box">
            <text class="highlight-text">{{ line.content }}</text>
          </view>
          <!-- 警告框 -->
          <view v-else-if="line.type === 'warning'" class="warning-box">
            <text class="warning-icon">⚠️</text>
            <text class="warning-text">{{ line.content }}</text>
          </view>
          <!-- 加粗文本 -->
          <text v-else-if="line.type === 'bold'" class="bold-text">{{ line.content }}</text>
          <!-- 普通文本 -->
          <text v-else class="normal-text">{{ line.content }}</text>
        </block>
      </view>
    </CollapsibleSection>

    <!-- 追问 -->
    <Card v-if="question.followUps.length > 0" class="followup-card">
      <text class="card-title">常见追问</text>
      <view 
        v-for="(followUp, index) in question.followUps" 
        :key="index"
        class="followup-item"
      >
        <view class="followup-q">
          <text class="q-label">Q:</text>
          <text class="q-text">{{ followUp.question }}</text>
        </view>
        <view class="followup-a">
          <text class="a-label">A:</text>
          <text class="a-text">{{ followUp.answer }}</text>
        </view>
      </view>
    </Card>

    <!-- 评论区 -->
    <view class="comment-area">
      <text class="area-title">评论 ({{ question.commentList.length }})</text>
      <CommentSection
        :comments="question.commentList"
        @like="handleCommentLike"
        @reply="handleCommentReply"
        @submit="handleCommentSubmit"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 题目详情页面（核心）
 * 问题卡片、ActionButtons、ProficiencySelector、折叠回答、追问、评论
 */
import { ref } from 'vue';
import { questions, difficultyConfig } from '@/data/mockData';
import type { Proficiency, Comment } from '@/types';
import Card from '@/components/Card.vue';
import Tag from '@/components/Tag.vue';
import ActionButtons from '@/components/ActionButtons.vue';
import ProficiencySelector from '@/components/ProficiencySelector.vue';
import CollapsibleSection from '@/components/CollapsibleSection.vue';
import CommentSection from '@/components/CommentSection.vue';

// 获取问题数据（实际项目中应该根据路由参数获取）
const question = ref(questions[0]);

// 当前熟练度
const currentProficiency = ref<Proficiency>(question.value.proficiency);

// 获取段落图标
const getSectionIcon = (icon: string): string => {
  const iconMap: Record<string, string> = {
    lightbulb: '💡',
    code: '💻',
    apps: '📱',
    warning: '⚠️',
    'trending-up': '📈',
  };
  return iconMap[icon] || '📝';
};

// 获取段落背景色
const getSectionBgColor = (icon: string): string => {
  const colorMap: Record<string, string> = {
    lightbulb: '#FEF3C7',
    code: '#EEF2FF',
    apps: '#D1FAE5',
    warning: '#FEE2E2',
    'trending-up': '#F3E8FF',
  };
  return colorMap[icon] || '#F8FAFC';
};

// 解析内容（简单模拟富文本）
const parseContent = (content: string) => {
  const lines = content.split('\n');
  return lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('function') || trimmed.startsWith('const') || trimmed.startsWith('let') || trimmed.startsWith('var')) {
      return { type: 'code', content: line };
    }
    if (trimmed.startsWith('注意') || trimmed.startsWith('⚠️')) {
      return { type: 'warning', content: trimmed.replace(/^注意[：:]?\s*/, '').replace(/^⚠️\s*/, '') };
    }
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      return { type: 'bold', content: trimmed.slice(2, -2) };
    }
    return { type: 'normal', content: line };
  }).filter(line => line.content.trim());
};

// 处理推荐
const handleRecommend = () => {
  uni.showToast({ title: '已推荐', icon: 'success' });
};

// 处理收藏
const handleFavorite = () => {
  question.value.isFavorite = !question.value.isFavorite;
  uni.showToast({ 
    title: question.value.isFavorite ? '已收藏' : '已取消收藏', 
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

// 处理评论点赞
const handleCommentLike = (commentId: string) => {
  console.log('点赞评论:', commentId);
};

// 处理评论回复
const handleCommentReply = (comment: Comment) => {
  console.log('回复评论:', comment);
};

// 处理评论提交
const handleCommentSubmit = (text: string, replyTo?: string) => {
  console.log('提交评论:', text, replyTo);
  uni.showToast({ title: '评论成功', icon: 'success' });
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

.question-title {
  font-size: $font-xl;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: $spacing-md;
  display: block;
}

.question-desc {
  font-size: $font-md;
  color: $text-secondary;
  line-height: 1.5;
  margin-bottom: $spacing-lg;
  display: block;
}

.question-meta {
  @include flex-row;
  gap: $spacing-xl;
}

.meta-item {
  font-family: 'uniicons';
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

.rich-content {
  @include flex-column;
  gap: $spacing-md;
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

.highlight-box {
  background-color: $primary-bg;
  border-left: 4rpx solid $primary;
  border-radius: 0 $radius-sm $radius-sm 0;
  padding: $spacing-md $spacing-lg;
}

.highlight-text {
  font-size: $font-md;
  color: $text-primary;
}

.warning-box {
  background-color: #FEF3C7;
  border-radius: $radius-md;
  padding: $spacing-md $spacing-lg;
  @include flex-row;
  gap: $spacing-sm;
}

.warning-icon {
  font-size: $font-md;
}

.warning-text {
  font-size: $font-md;
  color: $warning;
  flex: 1;
}

.bold-text {
  font-size: $font-md;
  font-weight: 600;
  color: $text-primary;
}

.normal-text {
  font-size: $font-md;
  color: $text-primary;
  line-height: 1.6;
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
  margin-bottom: $spacing-sm;
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
  font-weight: 500;
}

.followup-a {
  @include flex-row;
  align-items: flex-start;
}

.a-label {
  font-size: $font-md;
  font-weight: 600;
  color: $success;
  margin-right: $spacing-sm;
  flex-shrink: 0;
}

.a-text {
  font-size: $font-md;
  color: $text-secondary;
  line-height: 1.5;
  flex: 1;
}

// 评论区
.comment-area {
  margin-top: $spacing-xl;
}

.area-title {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;
  display: block;
}
</style>
