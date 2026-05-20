<template>
  <!-- 评论区组件 -->
  <view class="comment-section">
    <!-- 评论列表 -->
    <view class="comment-list">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @like="handleLike"
        @reply="handleReply"
      />
    </view>
    
    <!-- 空状态 -->
    <view v-if="comments.length === 0" class="empty-comments">
      <text class="empty-text">暂无评论，快来抢沙发吧~</text>
    </view>
    
    <!-- 底部输入框 -->
    <view class="comment-input-bar">
      <view class="input-wrapper">
        <text v-if="replyTo" class="reply-hint">回复 @{{ replyTo }}:</text>
        <input
          v-model="inputText"
          class="comment-input"
          :placeholder="replyTo ? '请输入回复内容' : '写下你的评论...'"
          confirm-type="send"
          @confirm="handleSubmit"
        />
      </view>
      <view 
        class="send-btn"
        :class="{ active: inputText.trim() }"
        @click="handleSubmit"
      >
        <text class="send-text">发送</text>
      </view>
      <view v-if="replyTo" class="cancel-btn" @click="cancelReply">
        <text class="cancel-text">取消</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 评论区组件
 * 评论列表 + 底部输入框，支持回复状态
 */
import { ref } from 'vue';
import type { Comment } from '@/types';
import CommentItem from './CommentItem.vue';

interface Props {
  /** 评论列表 */
  comments: Comment[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** 点赞事件 */
  (e: 'like', commentId: string): void;
  /** 回复事件 */
  (e: 'reply', comment: Comment): void;
  /** 提交评论事件 */
  (e: 'submit', text: string, replyTo?: string): void;
}>();

// 输入框内容
const inputText = ref('');
// 回复对象
const replyTo = ref<string>('');
// 当前回复的评论
const currentReplyComment = ref<Comment | null>(null);

// 处理点赞
const handleLike = (commentId: string) => {
  emit('like', commentId);
};

// 处理回复
const handleReply = (comment: Comment) => {
  replyTo.value = comment.author;
  currentReplyComment.value = comment;
  emit('reply', comment);
};

// 取消回复
const cancelReply = () => {
  replyTo.value = '';
  currentReplyComment.value = null;
};

// 处理提交
const handleSubmit = () => {
  const text = inputText.value.trim();
  if (!text) return;
  
  emit('submit', text, replyTo.value || undefined);
  inputText.value = '';
  cancelReply();
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.comment-section {
  background-color: $card;
  border-radius: $radius-lg;
  @include card-shadow;
}

.comment-list {
  padding: 0 $spacing-xl;
}

.empty-comments {
  @include flex-center;
  padding: $spacing-xxl * 2;
}

.empty-text {
  font-size: $font-md;
  color: $text-muted;
}

.comment-input-bar {
  @include flex-row;
  padding: $spacing-lg $spacing-xl;
  border-top: 1rpx solid $border;
  gap: $spacing-md;
}

.input-wrapper {
  flex: 1;
  @include flex-column;
}

.reply-hint {
  font-size: $font-xs;
  color: $primary;
  margin-bottom: $spacing-xs;
}

.comment-input {
  height: 72rpx;
  padding: 0 $spacing-lg;
  background-color: $bg;
  border-radius: $radius-full;
  font-size: $font-md;
  color: $text-primary;
}

.send-btn {
  padding: $spacing-md $spacing-lg;
  background-color: $border;
  border-radius: $radius-full;
  @include flex-center;
}

.send-btn.active {
  background-color: $primary;
}

.send-text {
  font-size: $font-md;
  color: $text-muted;
}

.send-btn.active .send-text {
  color: #FFFFFF;
}

.cancel-btn {
  padding: $spacing-md $spacing-lg;
  @include flex-center;
}

.cancel-text {
  font-size: $font-md;
  color: $text-secondary;
}
</style>
