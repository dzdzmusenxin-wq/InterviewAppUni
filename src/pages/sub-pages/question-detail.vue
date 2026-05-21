<template>
  <view class="page-container">
    <text class="test-text">测试页面</text>
    <text class="test-text">问题ID: {{ questionId }}</text>
    <text class="test-text" v-if="error">{{ error }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getQuestionById } from '@/utils/supabase';

const questionId = ref('');
const error = ref('');

onLoad(async (options: Record<string, string>) => {
  console.info('[DEBUG] onLoad options:', options);
  
  if (options.id) {
    questionId.value = options.id;
    console.info('[DEBUG] 开始加载, id:', options.id);
    
    try {
      const data = await getQuestionById(options.id);
      console.info('[DEBUG] 获取到数据:', data);
      
      if (data) {
        questionId.value = data.id + ' - ' + data.content;
      } else {
        error.value = '未找到问题';
      }
    } catch (e) {
      console.error('[DEBUG] 错误:', e);
      error.value = String(e);
    }
  } else {
    error.value = '缺少ID参数';
  }
});
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 32rpx;
}

.test-text {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}
</style>
