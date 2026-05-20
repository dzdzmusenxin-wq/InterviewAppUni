<template>
  <!-- 提醒设置页面 -->
  <view class="page-container">
    <!-- 提醒开关 -->
    <Card class="settings-card">
      <SwitchItem
        v-model="settings.dailyReminder"
        label="每日学习提醒"
        description="每天定时提醒你进行学习"
      />
    </Card>

    <!-- 提醒时间 -->
    <Card v-if="settings.dailyReminder" class="settings-card">
      <text class="card-title">提醒时间</text>
      <picker mode="time" :value="settings.reminderTime" @change="onTimeChange">
        <view class="time-picker">
          <text class="time-text">{{ settings.reminderTime }}</text>
          <text class="arrow">&#xe6f8;</text>
        </view>
      </picker>
    </Card>

    <!-- 其他通知设置 -->
    <Card class="settings-card">
      <text class="card-title">其他通知</text>
      <SwitchItem
        v-model="settings.goalAchievement"
        label="目标达成通知"
        description="完成每日学习目标时通知你"
      />
      <SwitchItem
        v-model="settings.newQuestionAlert"
        label="新题上架通知"
        description="有新题目上架时通知你"
      />
    </Card>

    <!-- 保存按钮 -->
    <view class="action-area">
      <view class="save-btn" @click="saveSettings">
        <text class="btn-text">保存设置</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 提醒设置页面
 */
import { ref } from 'vue';
import { userProfile } from '@/data/mockData';
import type { NotificationSettings } from '@/types';
import Card from '@/components/Card.vue';
import SwitchItem from '@/components/SwitchItem.vue';

// 设置数据
const settings = ref<NotificationSettings>({
  dailyReminder: userProfile.reminderEnabled,
  reminderTime: userProfile.reminderTime,
  goalAchievement: true,
  newQuestionAlert: false,
});

// 时间选择变化
const onTimeChange = (e: any) => {
  settings.value.reminderTime = e.detail.value;
};

// 保存设置
const saveSettings = () => {
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

// 设置卡片
.settings-card {
  margin-bottom: $spacing-lg;
}

.card-title {
  font-size: $font-md;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-md;
  display: block;
}

// 时间选择器
.time-picker {
  @include flex-row;
  justify-content: space-between;
  padding: $spacing-md 0;
  border-top: 1rpx solid $border;
}

.time-text {
  font-size: $font-xl;
  font-weight: 500;
  color: $primary;
}

.arrow {
  font-family: 'uniicons';
  font-size: $font-md;
  color: $text-muted;
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
