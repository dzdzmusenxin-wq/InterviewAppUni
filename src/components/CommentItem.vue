<template>
  <!-- 单条评论组件 -->
  <view class="comment-item">
    <!-- 头部：头像、作者、时间 -->
    <view class="comment-header">
      <view class="avatar-wrapper">
        <text class="avatar-emoji">{{ comment.avatar }}</text>
      </view>
      <view class="author-info">
        <text class="author-name">{{ comment.author }}</text>
        <text class="comment-time">{{ comment.time }}</text>
      </view>
    </view>
    
    <!-- 引用块（如果有） -->
    <view v-if="comment.quote" class="quote-block">
      <text class="quote-text">{{ comment.quote }}</text>
    </view>
    
    <!-- 回复对象（如果有） -->
    <view v-if="comment.replyTo" class="reply-to">
      <text class="reply-text">回复 <text class="reply-name">@{{ comment.replyTo }}</text></text>
    </view>
    
    <!-- 评论正文 -->
    <text class="comment-text">{{ comment.text }}</text>
    
    <!-- 底部操作：点赞、回复 -->
    <view class="comment-actions">
      <view class="action-item" @click="handleLike">
        <text class="action-icon" :class="{ liked: isLiked }">&#xe6a0;</text>
        <text class="action-text" :class="{ liked: isLiked }">{{ likesCount }}</text>
      </view>
      <view class="action-item" @click="handleReply">
        <text class="action-icon">&#xe6a8;</text>
        <text class="action-text">回复</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 单条评论组件
 * 头像(emoji圆形)、作者、时间、引用块(蓝色左边框)、正文、点赞、回复
 */
import { ref } from 'vue';
import type { Comment } from '@/types';

interface Props {
  /** 评论数据 */
  comment: Comment;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** 点赞事件 */
  (e: 'like', commentId: string): void;
  /** 回复事件 */
  (e: 'reply', comment: Comment): void;
}>();

// 点赞状态（本地模拟）
const isLiked = ref(false);
const likesCount = ref(props.comment.likes);

// 处理点赞
const handleLike = () => {
  isLiked.value = !isLiked.value;
  likesCount.value += isLiked.value ? 1 : -1;
  emit('like', props.comment.id);
};

// 处理回复
const handleReply = () => {
  emit('reply', props.comment);
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.comment-item {
  padding: $spacing-lg 0;
  border-bottom: 1rpx solid $border;
  
  &:last-child {
    border-bottom: none;
  }
}

.comment-header {
  @include flex-row;
  margin-bottom: $spacing-md;
}

.avatar-wrapper {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-light, $primary);
  @include flex-center;
  margin-right: $spacing-md;
}

.avatar-emoji {
  font-size: $font-lg;
}

.author-info {
  @include flex-column;
}

.author-name {
  font-size: $font-md;
  font-weight: 500;
  color: $text-primary;
}

.comment-time {
  font-size: $font-xs;
  color: $text-muted;
  margin-top: 4rpx;
}

.quote-block {
  margin: $spacing-md 0;
  padding: $spacing-md $spacing-lg;
  background-color: $primary-bg;
  border-left: 4rpx solid $primary;
  border-radius: 0 $radius-sm $radius-sm 0;
}

.quote-text {
  font-size: $font-sm;
  color: $text-secondary;
  @include text-ellipsis-multi(2);
}

.reply-to {
  margin-bottom: $spacing-sm;
}

.reply-text {
  font-size: $font-sm;
  color: $text-secondary;
}

.reply-name {
  color: $primary;
  font-weight: 500;
}

.comment-text {
  font-size: $font-md;
  color: $text-primary;
  line-height: 1.6;
}

.comment-actions {
  @include flex-row;
  margin-top: $spacing-md;
  gap: $spacing-xl;
}

.action-item {
  @include flex-row;
  gap: $spacing-sm;
}

.action-icon {
  font-family: 'uniicons';
  font-size: $font-sm;
  color: $text-muted;
}

.action-icon.liked {
  color: $danger;
}

.action-text {
  font-size: $font-sm;
  color: $text-muted;
}

.action-text.liked {
  color: $danger;
}
</style>
