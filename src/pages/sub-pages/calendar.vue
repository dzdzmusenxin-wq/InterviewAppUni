<template>
  <!-- 学习日历页面 -->
  <view class="page-container">
    <!-- 月份切换 -->
    <view class="month-header">
      <text class="arrow" @click="prevMonth">&#xe679;</text>
      <text class="month-text">{{ currentYear }}年{{ currentMonth }}月</text>
      <text class="arrow" @click="nextMonth">&#xe6f8;</text>
    </view>

    <!-- 星期标题 -->
    <view class="week-header">
      <text v-for="day in weekDays" :key="day" class="week-day">{{ day }}</text>
    </view>

    <!-- 日历网格 -->
    <view class="calendar-grid">
      <view 
        v-for="(day, index) in calendarDays" 
        :key="index"
        class="day-cell"
        :class="{ 
          'other-month': !day.isCurrentMonth,
          'has-study': day.hasStudy,
          'today': day.isToday
        }"
        @click="selectDay(day)"
      >
        <text class="day-num">{{ day.date }}</text>
        <view v-if="day.hasStudy" class="study-indicator" />
      </view>
    </view>

    <!-- 选中日期的详情 -->
    <view v-if="selectedDay" class="day-detail">
      <Card>
        <view class="detail-header">
          <text class="detail-date">{{ selectedDay.fullDate }}</text>
          <view v-if="selectedDay.hasStudy" class="study-tag">
            <text class="tag-text">已学习</text>
          </view>
          <view v-else class="rest-tag">
            <text class="tag-text">休息日</text>
          </view>
        </view>
        <view v-if="selectedDay.hasStudy" class="detail-stats">
          <view class="stat-row">
            <text class="stat-label">学习时长</text>
            <text class="stat-value">{{ selectedDay.duration }} 分钟</text>
          </view>
          <view class="stat-row">
            <text class="stat-label">完成题目</text>
            <text class="stat-value">{{ selectedDay.count }} 题</text>
          </view>
        </view>
        <view v-else class="detail-empty">
          <text class="empty-text">今天没有学习记录哦~</text>
        </view>
      </Card>
    </view>

    <!-- 本月统计 -->
    <view class="month-stats">
      <Card>
        <text class="stats-title">本月统计</text>
        <view class="stats-grid">
          <view class="stats-item">
            <text class="item-value">{{ monthStats.studyDays }}</text>
            <text class="item-label">学习天数</text>
          </view>
          <view class="stats-item">
            <text class="item-value">{{ monthStats.totalDuration }}</text>
            <text class="item-label">总时长(分)</text>
          </view>
          <view class="stats-item">
            <text class="item-value">{{ monthStats.totalQuestions }}</text>
            <text class="item-label">完成题目</text>
          </view>
        </view>
      </Card>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 学习日历页面
 */
import { ref, computed } from 'vue';
import { studyCalendarData } from '@/data/mockData';
import Card from '@/components/Card.vue';

// 星期标题
const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

// 当前日期
const now = new Date();
const currentYear = ref(now.getFullYear());
const currentMonth = ref(now.getMonth() + 1);

// 选中的日期
const selectedDay = ref<any>(null);

// 日历天数
const calendarDays = computed(() => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value, 0);
  const prevLastDay = new Date(currentYear.value, currentMonth.value - 1, 0);
  
  // 上个月的日期
  const firstDayWeek = firstDay.getDay();
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    const date = prevLastDay.getDate() - i;
    days.push({
      date,
      isCurrentMonth: false,
      hasStudy: false,
      isToday: false,
    });
  }
  
  // 当前月的日期
  const today = new Date();
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const studyData = studyCalendarData.find(d => d.date === dateStr);
    const isToday = today.getFullYear() === currentYear.value && 
                    today.getMonth() + 1 === currentMonth.value && 
                    today.getDate() === i;
    
    days.push({
      date: i,
      isCurrentMonth: true,
      hasStudy: !!studyData && studyData.count > 0,
      isToday,
      fullDate: dateStr,
      ...studyData,
    });
  }
  
  // 下个月的日期
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      hasStudy: false,
      isToday: false,
    });
  }
  
  return days;
});

// 本月统计
const monthStats = computed(() => {
  const monthData = studyCalendarData.filter(d => {
    const date = new Date(d.date);
    return date.getFullYear() === currentYear.value && 
           date.getMonth() + 1 === currentMonth.value;
  });
  
  return {
    studyDays: monthData.filter(d => d.count > 0).length,
    totalDuration: monthData.reduce((sum, d) => sum + d.duration, 0),
    totalQuestions: monthData.reduce((sum, d) => sum + d.count, 0),
  };
});

// 上个月
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  selectedDay.value = null;
};

// 下个月
const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  selectedDay.value = null;
};

// 选择日期
const selectDay = (day: any) => {
  if (!day.isCurrentMonth) return;
  selectedDay.value = day;
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

// 月份头部
.month-header {
  @include flex-row;
  justify-content: space-between;
  padding: $spacing-lg 0;
}

.arrow {
  font-family: 'uniicons';
  font-size: $font-lg;
  color: $text-secondary;
  padding: $spacing-sm;
}

.month-text {
  font-size: $font-xl;
  font-weight: 600;
  color: $text-primary;
}

// 星期标题
.week-header {
  @include flex-row;
  justify-content: space-around;
  padding: $spacing-md 0;
  border-bottom: 1rpx solid $border;
}

.week-day {
  font-size: $font-md;
  color: $text-secondary;
  width: 80rpx;
  text-align: center;
}

// 日历网格
calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: $spacing-sm;
  padding: $spacing-md 0;
}

.day-cell {
  aspect-ratio: 1;
  @include flex-column;
  align-items: center;
  justify-content: center;
  border-radius: $radius-md;
  position: relative;
}

.day-cell.other-month {
  opacity: 0.3;
}

.day-cell.today {
  background-color: $primary-bg;
}

.day-cell.has-study {
  background-color: #D1FAE5;
}

.day-num {
  font-size: $font-md;
  color: $text-primary;
}

.study-indicator {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background-color: $success;
  position: absolute;
  bottom: 8rpx;
}

// 日期详情
.day-detail {
  margin-top: $spacing-xl;
}

.detail-header {
  @include flex-row;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
}

.detail-date {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
}

.study-tag {
  padding: 4rpx 16rpx;
  background-color: $success;
  border-radius: $radius-full;
}

.rest-tag {
  padding: 4rpx 16rpx;
  background-color: $border;
  border-radius: $radius-full;
}

.tag-text {
  font-size: $font-sm;
  color: #FFFFFF;
}

.rest-tag .tag-text {
  color: $text-secondary;
}

.detail-stats {
  @include flex-column;
  gap: $spacing-md;
}

.stat-row {
  @include flex-row;
  justify-content: space-between;
}

.stat-label {
  font-size: $font-md;
  color: $text-secondary;
}

.stat-value {
  font-size: $font-md;
  font-weight: 500;
  color: $text-primary;
}

.detail-empty {
  @include flex-center;
  padding: $spacing-xl;
}

.empty-text {
  font-size: $font-md;
  color: $text-muted;
}

// 本月统计
.month-stats {
  margin-top: $spacing-xl;
}

.stats-title {
  font-size: $font-md;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;
  display: block;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
}

.stats-item {
  @include flex-column;
  align-items: center;
}

.item-value {
  font-size: $font-xxl;
  font-weight: 700;
  color: $primary;
}

.item-label {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: $spacing-xs;
}
</style>
