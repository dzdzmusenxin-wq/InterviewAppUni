<template>
  <!-- 场景详情页面 -->
  <view class="page-container">
    <!-- 场景头部 -->
    <view class="scene-header">
      <view class="scene-icon-wrapper">
        <text class="scene-icon">{{ sceneIcon }}</text>
      </view>
      <text class="scene-title">{{ sceneTitle }}</text>
      <text class="scene-desc">{{ sceneDescription }}</text>
    </view>

    <!-- 场景问题列表 -->
    <SectionHeader :title="`问题列表 (${sceneQuestions.length})`" />
    <view class="question-list">
      <view 
        v-for="(question, index) in sceneQuestions" 
        :key="index"
        class="question-item"
        @click="goToQuestion(question)"
      >
        <view class="question-number">
          <text class="number-text">{{ index + 1 }}</text>
        </view>
        <view class="question-content">
          <text class="question-title">{{ question }}</text>
        </view>
        <text class="question-arrow">&#xe6f8;</text>
      </view>
    </view>

    <!-- 练习建议 -->
    <Card class="tips-card">
      <view class="tips-header">
        <text class="tips-icon">💡</text>
        <text class="tips-title">练习建议</text>
      </view>
      <text class="tips-text">{{ practiceTips }}</text>
    </Card>

    <!-- 开始练习按钮 -->
    <view class="action-area">
      <view class="practice-btn" @click="startPractice">
        <text class="btn-text">开始练习</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 场景详情页面
 */
import { ref, computed } from 'vue';
import { scenes } from '@/data/mockData';
import type { SceneType } from '@/types';
import SectionHeader from '@/components/SectionHeader.vue';
import Card from '@/components/Card.vue';

// 场景类型（实际项目中应该从路由参数获取）
const sceneType = ref<SceneType>('intro');

// 当前场景数据
const currentScene = computed(() => {
  return scenes.find(s => s.type === sceneType.value) || scenes[0];
});

// 场景图标
const sceneIcon = computed(() => {
  const iconMap: Record<string, string> = {
    'intro': '👤',
    'project': '📁',
    'technical': '💻',
    'hr': '💬',
  };
  return iconMap[sceneType.value] || '📋';
});

// 场景标题
const sceneTitle = computed(() => currentScene.value.title);

// 场景描述
const sceneDescription = computed(() => currentScene.value.description);

// 场景问题列表（模拟数据）
const sceneQuestions = ref([
  '请简单介绍一下你自己',
  '你的优点和缺点是什么？',
  '你为什么选择我们公司？',
  '你的职业规划是什么？',
  '你有什么想问我的吗？',
]);

// 练习建议
const practiceTips = computed(() => {
  const tipsMap: Record<string, string> = {
    'intro': '自我介绍要控制在1-2分钟，重点突出与岗位相关的经验和技能，保持自信但不傲慢的态度。',
    'project': '使用STAR法则（情境-任务-行动-结果）来描述项目，突出你的贡献和成果。',
    'technical': '回答要有条理，可以先给出结论再解释原因，适当举例说明，不懂的问题坦诚承认。',
    'hr': 'HR问题主要考察价值观匹配度，回答要真诚，展现你的职业素养和团队合作精神。',
  };
  return tipsMap[sceneType.value] || '保持自信，真诚回答，展现最好的自己。';
});

// 跳转到问题
const goToQuestion = (question: string) => {
  uni.showToast({ title: '查看问题详情', icon: 'none' });
};

// 开始练习
const startPractice = () => {
  uni.showToast({ title: '开始练习模式', icon: 'success' });
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

// 场景头部
.scene-header {
  @include flex-column;
  align-items: center;
  padding: $spacing-xxl 0;
}

.scene-icon-wrapper {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-bg, #FFFFFF);
  @include flex-center;
  margin-bottom: $spacing-lg;
}

.scene-icon {
  font-size: 60rpx;
}

.scene-title {
  font-size: $font-xxl;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.scene-desc {
  font-size: $font-md;
  color: $text-secondary;
  text-align: center;
}

// 问题列表
.question-list {
  @include flex-column;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
}

.question-item {
  @include flex-row;
  background-color: $card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  @include card-shadow;
}

.question-number {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background-color: $primary-bg;
  @include flex-center;
  margin-right: $spacing-md;
  flex-shrink: 0;
}

.number-text {
  font-size: $font-md;
  font-weight: 600;
  color: $primary;
}

.question-content {
  flex: 1;
  @include flex-column;
  justify-content: center;
}

.question-title {
  font-size: $font-md;
  color: $text-primary;
}

.question-arrow {
  font-family: 'uniicons';
  font-size: $font-md;
  color: $text-muted;
  margin-left: $spacing-md;
}

// 提示卡片
.tips-card {
  margin-bottom: $spacing-xl;
}

.tips-header {
  @include flex-row;
  margin-bottom: $spacing-md;
}

.tips-icon {
  font-size: $font-lg;
  margin-right: $spacing-sm;
}

.tips-title {
  font-size: $font-md;
  font-weight: 600;
  color: $text-primary;
}

.tips-text {
  font-size: $font-md;
  color: $text-secondary;
  line-height: 1.6;
}

// 操作区域
.action-area {
  margin-top: $spacing-xl;
}

.practice-btn {
  background: linear-gradient(135deg, $primary, $primary-light);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  @include flex-center;
}

.btn-text {
  font-size: $font-lg;
  font-weight: 600;
  color: #FFFFFF;
}
</style>
