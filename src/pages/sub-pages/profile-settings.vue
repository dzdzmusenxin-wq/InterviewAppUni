<template>
  <!-- 个人设置页面 -->
  <view class="page-container">
    <!-- 头像设置 -->
    <Card class="avatar-card">
      <view class="avatar-section" @click="changeAvatar">
        <image class="avatar-img" :src="profile.avatar" mode="aspectFill" />
        <text class="avatar-hint">点击更换头像</text>
      </view>
    </Card>

    <!-- 基本信息 -->
    <Card class="info-card">
      <text class="card-title">基本信息</text>
      <view class="form-item">
        <text class="form-label">昵称</text>
        <input 
          v-model="profile.nickname" 
          class="form-input" 
          placeholder="请输入昵称"
        />
      </view>
      <view class="form-item">
        <text class="form-label">简介</text>
        <textarea 
          v-model="profile.bio" 
          class="form-textarea" 
          placeholder="请输入个人简介"
          :maxlength="100"
        />
        <text class="char-count">{{ profile.bio.length }}/100</text>
      </view>
    </Card>

    <!-- 账号设置 -->
    <Card class="account-card">
      <text class="card-title">账号设置</text>
      <view class="menu-item" @click="changePassword">
        <text class="menu-label">修改密码</text>
        <text class="menu-arrow">&#xe6f8;</text>
      </view>
      <view class="menu-item" @click="bindPhone">
        <text class="menu-label">绑定手机</text>
        <view class="menu-right">
          <text class="menu-status">已绑定</text>
          <text class="menu-arrow">&#xe6f8;</text>
        </view>
      </view>
      <view class="menu-item" @click="bindEmail">
        <text class="menu-label">绑定邮箱</text>
        <view class="menu-right">
          <text class="menu-status">未绑定</text>
          <text class="menu-arrow">&#xe6f8;</text>
        </view>
      </view>
    </Card>

    <!-- 其他设置 -->
    <Card class="other-card">
      <text class="card-title">其他</text>
      <view class="menu-item" @click="clearCache">
        <text class="menu-label">清除缓存</text>
        <view class="menu-right">
          <text class="menu-status">12.5MB</text>
          <text class="menu-arrow">&#xe6f8;</text>
        </view>
      </view>
      <view class="menu-item" @click="aboutUs">
        <text class="menu-label">关于我们</text>
        <text class="menu-arrow">&#xe6f8;</text>
      </view>
    </Card>

    <!-- 保存按钮 -->
    <view class="action-area">
      <view class="save-btn" @click="saveProfile">
        <text class="btn-text">保存修改</text>
      </view>
      <view class="logout-btn" @click="logout">
        <text class="logout-text">退出登录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 个人设置页面
 */
import { ref } from 'vue';
import { userProfile } from '@/data/mockData';
import Card from '@/components/Card.vue';

// 个人资料
const profile = ref({ ...userProfile });

// 更换头像
const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      profile.value.avatar = res.tempFilePaths[0];
    },
  });
};

// 修改密码
const changePassword = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' });
};

// 绑定手机
const bindPhone = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' });
};

// 绑定邮箱
const bindEmail = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' });
};

// 清除缓存
const clearCache = () => {
  uni.showModal({
    title: '提示',
    content: '确定清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '清除成功', icon: 'success' });
      }
    },
  });
};

// 关于我们
const aboutUs = () => {
  uni.showToast({ title: '面试通 v1.0.0', icon: 'none' });
};

// 保存资料
const saveProfile = () => {
  uni.showToast({
    title: '保存成功',
    icon: 'success',
  });
};

// 退出登录
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已退出', icon: 'success' });
        // 实际项目中这里应该清除登录状态并跳转到登录页
      }
    },
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

// 头像卡片
.avatar-card {
  margin-bottom: $spacing-lg;
}

.avatar-section {
  @include flex-column;
  align-items: center;
  padding: $spacing-xl 0;
}

.avatar-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  margin-bottom: $spacing-md;
}

.avatar-hint {
  font-size: $font-sm;
  color: $text-secondary;
}

// 信息卡片
.info-card {
  margin-bottom: $spacing-lg;
}

.card-title {
  font-size: $font-md;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;
  display: block;
}

.form-item {
  margin-bottom: $spacing-lg;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  font-size: $font-sm;
  color: $text-secondary;
  margin-bottom: $spacing-sm;
  display: block;
}

.form-input {
  height: 80rpx;
  padding: 0 $spacing-md;
  background-color: $bg;
  border-radius: $radius-md;
  font-size: $font-md;
  color: $text-primary;
}

.form-textarea {
  height: 160rpx;
  padding: $spacing-md;
  background-color: $bg;
  border-radius: $radius-md;
  font-size: $font-md;
  color: $text-primary;
}

.char-count {
  font-size: $font-xs;
  color: $text-muted;
  text-align: right;
  margin-top: $spacing-xs;
  display: block;
}

// 账号卡片
.account-card,
.other-card {
  margin-bottom: $spacing-lg;
}

.menu-item {
  @include flex-row;
  justify-content: space-between;
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

.menu-label {
  font-size: $font-md;
  color: $text-primary;
}

.menu-right {
  @include flex-row;
}

.menu-status {
  font-size: $font-sm;
  color: $text-secondary;
  margin-right: $spacing-sm;
}

.menu-arrow {
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
  margin-bottom: $spacing-lg;
}

.btn-text {
  font-size: $font-lg;
  font-weight: 600;
  color: #FFFFFF;
}

.logout-btn {
  background-color: $card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  @include flex-center;
  border: 2rpx solid $danger;
}

.logout-text {
  font-size: $font-lg;
  font-weight: 600;
  color: $danger;
}
</style>
