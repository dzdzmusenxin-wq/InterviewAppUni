<template>
  <!-- 目标设置页面 -->
  <view class="page-container">
    <!-- 当前目标 -->
    <Card class="goal-card">
      <text class="card-title">每日学习目标</text>
      <view class="goal-display">
        <text class="goal-num">{{ dailyGoal }}</text>
        <text class="goal-unit">题/天</text>
      </view>
      <view class="goal-slider">
        <slider 
          :value="dailyGoal" 
          :min="1" 
          :max="20" 
          :step="1"
          active-color="#4F46E5"
          background-color="#E2E8F0"
          block-color="#4F46E5"
          @change="onGoalChange"
        />
        <view class="slider-labels">
          <text class="label">1</text>
          <text class="label">10</text>
          <text class="label">20</text>
        </view>
      </view>
    </Card>

    <!-- 目标建议 -->
    <Card class="tips-card">
      <text class="card-title">目标建议</text>
      <view class="tips-list">
        <view class="tip-item">
          <text class="tip-icon">🌱</text>
          <view class="tip-content">
            <text class="tip-title">初学者</text>
            <text class="tip-desc">建议每天 3-5 题，循序渐进</text>
          </view>
        </view>
        <view class="tip-item">
          <text class="tip-icon">🌿</text>
          <view class="tip-content">
            <text class="tip-title">进阶者</text>
            <text class="tip-desc">建议每天 5-10 题，稳步提升</text>
          </view>
        </view>
        <view class="tip-item">
          <text class="tip-icon">🌳</text>
          <view class="tip-content">
            <text class="tip-title">冲刺者</text>
            <text class="tip-desc">建议每天 10-15 题，全力冲刺</text>
          </view>
        </view>
      </view>
    </Card>

    <!-- 本周完成情况 -->
    <Card class="weekly-card">
      <text class="card-title">本周完成情况</text>
      <view class="weekly-chart">
        <view 
          v-for="(day, index) in weeklyData" 
          :key="index"
          class="chart-bar"
        >
          <view 
            class="bar-fill"
            :style="{ height: (day.completed / dailyGoal * 100) + '%' }"
            :class="{ 'bar-full': day.completed >= dailyGoal }"
          />
          <text class="bar-label">{{ day.day }}</text>
        </view>
      </view>
    </Card>

    <!-- 保存按钮 -->
    <view class="action-area">
      <view class="save-btn" @click="saveGoal">
        <text class="btn-text">保存目标</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 目标设置页面
 */
import { ref } from 'vue';
import { userProfile } from '@/data/mockData';
import Card from '@/components/Card.vue';

// 每日目标
const dailyGoal = ref(userProfile.stats.dailyGoal);

// 本周数据（模拟）
const weeklyData = ref([
  { day: '一', completed: 5 },
  { day: '二', completed: 3 },
  { day: '三', completed: 5 },
  { day: '四', completed: 4 },
  { day: '五', completed: 0 },
  { day: '六', completed: 0 },
  { day: '日', completed: 0 },
]);

// 目标变化
const onGoalChange = (e: any) => {
  dailyGoal.value = e.detail.value;
};

// 保存目标
const saveGoal = () => {
  uni.showToast({
    title: '保存成功',
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

// 目标卡片
.goal-card {
  margin-bottom: $spacing-lg;
}

.card-title {
  font-size: $font-md;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;
  display: block;
}

.goal-display {
  @include flex-row;
  justify-content: center;
  align-items: baseline;
  margin-bottom: $spacing-xl;
}

.goal-num {
  font-size: 80rpx;
  font-weight: 700;
  color: $primary;
}

.goal-unit {
  font-size: $font-lg;
  color: $text-secondary;
  margin-left: $spacing-sm;
}

.goal-slider {
  padding: 0 $spacing-md;
}

.slider-labels {
  @include flex-row;
  justify-content: space-between;
  margin-top: $spacing-sm;
}

.label {
  font-size: $font-sm;
  color: $text-muted;
}

// 建议卡片
.tips-card {
  margin-bottom: $spacing-lg;
}

.tips-list {
  @include flex-column;
  gap: $spacing-lg;
}

.tip-item {
  @include flex-row;
}

.tip-icon {
  font-size: 48rpx;
  margin-right: $spacing-md;
}

.tip-content {
  @include flex-column;
}

.tip-title {
  font-size: $font-md;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 4rpx;
}

.tip-desc {
  font-size: $font-sm;
  color: $text-secondary;
}

// 周统计卡片
.weekly-card {
  margin-bottom: $spacing-lg;
}

.weekly-chart {
  @include flex-row;
  justify-content: space-around;
  align-items: flex-end;
  height: 200rpx;
  padding-top: $spacing-lg;
}

.chart-bar {
  @include flex-column;
  align-items: center;
  width: 60rpx;
  height: 100%;
  justify-content: flex-end;
}

.bar-fill {
  width: 40rpx;
  background-color: $primary;
  border-radius: $radius-sm $radius-sm 0 0;
  transition: height 0.3s ease;
  min-height: 4rpx;
}

.bar-fill.bar-full {
  background-color: $success;
}

.bar-label {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: $spacing-sm;
}

// 操作区域
.action-area {
  margin-top: $spacing-xl;
}

.save-btn {
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
