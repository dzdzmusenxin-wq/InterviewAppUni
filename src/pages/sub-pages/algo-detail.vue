<template>
  <!-- 算法详情页面 -->
  <view class="page-container">
    <!-- 题目头部 -->
    <Card class="algo-header">
      <view class="header-top">
        <view class="algo-number">{{ algo.number }}</view>
        <Tag 
          :text="difficultyConfig[algo.difficulty].label" 
          :variant="algo.difficulty" 
          size="small" 
        />
      </view>
      <text class="algo-title">{{ algo.title }}</text>
      <view class="algo-tags">
        <Tag 
          v-for="tag in algo.tags" 
          :key="tag" 
          :text="tag" 
          size="small" 
        />
      </view>
    </Card>

    <!-- 题目描述 -->
    <Card class="desc-card">
      <text class="card-title">题目描述</text>
      <text class="desc-text">{{ algoDescription }}</text>
    </Card>

    <!-- 示例 -->
    <Card class="example-card">
      <text class="card-title">示例</text>
      <view class="example-block">
        <text class="example-label">输入:</text>
        <text class="example-code">{{ exampleInput }}</text>
      </view>
      <view class="example-block">
        <text class="example-label">输出:</text>
        <text class="example-code">{{ exampleOutput }}</text>
      </view>
    </Card>

    <!-- 解题思路 -->
    <Card class="solution-card">
      <text class="card-title">解题思路</text>
      <text class="solution-text">{{ solutionText }}</text>
    </Card>

    <!-- 代码实现 -->
    <Card class="code-card">
      <view class="code-header">
        <text class="card-title">代码实现</text>
        <view class="lang-selector">
          <text 
            v-for="lang in languages" 
            :key="lang"
            class="lang-item"
            :class="{ active: currentLang === lang }"
            @click="currentLang = lang"
          >
            {{ lang }}
          </text>
        </view>
      </view>
      <view class="code-block">
        <text class="code-text">{{ codeImplementation }}</text>
      </view>
    </Card>

    <!-- 操作按钮 -->
    <view class="action-area">
      <view 
        class="action-btn"
        :class="{ done: algo.isDone }"
        @click="toggleDone"
      >
        <text class="btn-text">{{ algo.isDone ? '已完成' : '标记完成' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 算法详情页面
 */
import { ref, computed } from 'vue';
import { algoQuestions, difficultyConfig } from '@/data/mockData';
import type { AlgoQuestion } from '@/types';
import Card from '@/components/Card.vue';
import Tag from '@/components/Tag.vue';

// 算法数据（实际项目中应该从路由参数获取）
const algo = ref<AlgoQuestion>(algoQuestions[0]);

// 编程语言
const languages = ['JavaScript', 'TypeScript', 'Python'];
const currentLang = ref('JavaScript');

// 题目描述（模拟）
const algoDescription = computed(() => {
  return `给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。`;
});

// 示例输入
const exampleInput = 'nums = [2,7,11,15], target = 9';

// 示例输出
const exampleOutput = '[0,1]';

// 解题思路
const solutionText = `使用哈希表来优化查找过程。遍历数组时，对于每个元素，计算 target 与该元素的差值，然后在哈希表中查找是否存在该差值。如果存在，则找到了答案；如果不存在，则将当前元素存入哈希表，继续遍历。`;

// 代码实现
const codeImplementation = computed(() => {
  const codeMap: Record<string, string> = {
    'JavaScript': `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    'TypeScript': `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    'Python': `def twoSum(nums, target):
    map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in map:
            return [map[complement], i]
        map[num] = i
    return []`,
  };
  return codeMap[currentLang.value] || codeMap['JavaScript'];
});

// 切换完成状态
const toggleDone = () => {
  algo.value.isDone = !algo.value.isDone;
  uni.showToast({
    title: algo.value.isDone ? '已标记完成' : '已取消完成',
    icon: 'success',
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

// 算法头部
.algo-header {
  margin-bottom: $spacing-lg;
}

.header-top {
  @include flex-row;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.algo-number {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background-color: $primary;
  @include flex-center;
  font-size: $font-sm;
  font-weight: 600;
  color: #FFFFFF;
}

.algo-title {
  font-size: $font-xl;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: $spacing-md;
  display: block;
}

.algo-tags {
  @include flex-row;
  gap: $spacing-sm;
}

// 卡片通用样式
.desc-card,
.example-card,
.solution-card,
.code-card {
  margin-bottom: $spacing-lg;
}

.card-title {
  font-size: $font-md;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-md;
  display: block;
}

.desc-text,
.solution-text {
  font-size: $font-md;
  color: $text-secondary;
  line-height: 1.6;
}

// 示例
.example-block {
  margin-bottom: $spacing-md;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.example-label {
  font-size: $font-sm;
  color: $text-muted;
  margin-bottom: $spacing-xs;
  display: block;
}

.example-code {
  font-family: 'Courier New', monospace;
  font-size: $font-md;
  color: $text-primary;
  background-color: $bg;
  padding: $spacing-md;
  border-radius: $radius-md;
  display: block;
}

// 代码卡片
.code-header {
  @include flex-row;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.lang-selector {
  @include flex-row;
  gap: $spacing-md;
}

.lang-item {
  font-size: $font-sm;
  color: $text-secondary;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-sm;
}

.lang-item.active {
  background-color: $primary-bg;
  color: $primary;
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
  line-height: 1.6;
}

// 操作区域
.action-area {
  margin-top: $spacing-xl;
}

.action-btn {
  background: linear-gradient(135deg, $primary, $primary-light);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  @include flex-center;
}

.action-btn.done {
  background: $success;
}

.btn-text {
  font-size: $font-lg;
  font-weight: 600;
  color: #FFFFFF;
}
</style>
