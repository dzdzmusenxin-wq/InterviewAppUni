<template>
  <view class="page-container">
    <!-- 顶部操作栏 -->
    <view class="header">
      <text class="title">问题管理</text>
      <view class="header-actions">
        <view class="search-box">
          <text class="search-icon">&#xe596;</text>
          <input 
            class="search-input" 
            placeholder="搜索问题" 
            v-model="searchKeyword"
            @input="handleSearch"
          />
        </view>
        <view class="add-btn" @click="showAddModal">
          <text class="add-icon">&#xe60b;</text>
          <text>添加</text>
        </view>
      </view>
    </view>

    <!-- 问题列表 -->
    <view class="question-list">
      <view 
        v-for="question in filteredQuestions" 
        :key="question.id" 
        class="question-item"
      >
        <view class="question-content">
          <text class="question-text">{{ question.content }}</text>
          <view class="question-meta">
            <view class="category-tag">{{ question.category }}</view>
            <view class="tags-wrap">
              <text 
                v-for="tag in question.tags.slice(0, 3)" 
                :key="tag" 
                class="tag"
              >{{ tag }}</text>
              <text v-if="question.tags.length > 3" class="tag">+{{ question.tags.length - 3 }}</text>
            </view>
          </view>
        </view>
        <view class="question-actions">
          <view class="action-btn edit" @click="showEditModal(question)">
            <text>&#xe642;</text>
          </view>
          <view class="action-btn delete" @click="deleteQuestion(question.id)">
            <text>&#xe640;</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="filteredQuestions.length === 0" class="empty-state">
        <text class="empty-icon">&#xe65c;</text>
        <text class="empty-text">暂无问题数据</text>
      </view>
    </view>

    <!-- 添加/编辑弹窗 -->
    <view v-if="showModal" class="modal-overlay" @click="closeModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ isEdit ? '编辑问题' : '添加问题' }}</text>
          <view class="modal-close" @click="closeModal">
            <text>&#xe60e;</text>
          </view>
        </view>

        <scroll-view scroll-y class="modal-body">
          <!-- 问题内容 -->
          <view class="form-item">
            <text class="form-label">问题内容 *</text>
            <textarea 
              class="form-textarea" 
              placeholder="请输入问题内容" 
              v-model="formData.content"
              :maxlength="2000"
            />
          </view>

          <!-- 分类 -->
          <view class="form-item">
            <text class="form-label">分类 *</text>
            <input 
              class="form-input" 
              placeholder="请输入分类名称（如：JavaScript、Vue.js）" 
              v-model="formData.category"
            />
            <view class="category-suggestions">
              <text 
                v-for="cat in categorySuggestions" 
                :key="cat" 
                class="suggestion-tag"
                @click="formData.category = cat"
              >{{ cat }}</text>
            </view>
          </view>

          <!-- 标签 -->
          <view class="form-item">
            <text class="form-label">标签</text>
            <view class="tags-input">
              <view 
                v-for="(tag, index) in formData.tags" 
                :key="index" 
                class="tag-item"
              >
                <text>{{ tag }}</text>
                <text class="tag-remove" @click="removeTag(index)">&#xe60e;</text>
              </view>
              <input 
                class="tag-input" 
                placeholder="按分号 ; 分隔多个标签" 
                v-model="newTag"
                @input="onTagInput"
                @confirm="addTag"
              />
            </view>
          </view>

          <!-- 回答 -->
          <view class="form-item">
            <text class="form-label">回答 *</text>
            <textarea 
              class="form-textarea large" 
              placeholder="请输入回答内容（支持 Markdown 格式）" 
              v-model="formData.answer"
              :maxlength="10000"
            />
          </view>

          <!-- 实际应用场景 -->
          <view class="form-item">
            <text class="form-label">实际应用场景</text>
            <textarea 
              class="form-textarea" 
              placeholder="请输入实际应用场景" 
              v-model="formData.application_scenarios"
              :maxlength="5000"
            />
          </view>

          <!-- 代码片段 -->
          <view class="form-item">
            <text class="form-label">代码片段</text>
            <textarea 
              class="form-textarea code" 
              placeholder="请输入代码片段" 
              v-model="formData.code_example"
              :maxlength="8000"
            />
          </view>

          <!-- 深入理解 -->
          <view class="form-item">
            <text class="form-label">深入理解</text>
            <textarea 
              class="form-textarea" 
              placeholder="请输入深入理解内容" 
              v-model="formData.advanced_understanding"
              :maxlength="8000"
            />
          </view>

          <!-- 注意事项 -->
          <view class="form-item">
            <text class="form-label">注意事项</text>
            <textarea 
              class="form-textarea" 
              placeholder="请输入注意事项" 
              v-model="formData.notes"
              :maxlength="5000"
            />
          </view>

          <!-- 追问关联（父问题） -->
          <view class="form-item">
            <text class="form-label">追问关联（父问题ID）</text>
            <input 
              class="form-input" 
              placeholder="输入父问题ID，留空表示独立问题" 
              v-model="formData.parent_id"
            />
            <text class="form-hint">可从问题列表查看问题ID</text>
          </view>
        </scroll-view>

        <view class="modal-footer">
          <view class="btn btn-cancel" @click="closeModal">取消</view>
          <view class="btn btn-confirm" @click="submitForm">保存</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getAllQuestionsFromTable, getQuestionsByCategory, insertQuestionToTable, updateQuestionInTable, deleteQuestionFromTable } from '@/utils/supabase';

// 表单数据类型
interface QuestionForm {
  id?: string;
  content: string;
  category: string;
  tags: string[];
  answer: string;
  application_scenarios: string;
  code_example: string;
  advanced_understanding: string;
  notes: string;
  parent_id: string | null;
}

// 分类列表
const categories = [
  'JavaScript',
  'TypeScript',
  'Vue.js',
  'React',
  'CSS/样式',
  '性能优化',
  '架构设计',
  '安全',
  '网络相关',
  '算法题'
];

// 分类建议
const categorySuggestions = computed(() => {
  return categories;
});

// 搜索关键词
const searchKeyword = ref('');

// 问题列表
const questions = ref<any[]>([]);

// 筛选后的问题列表
const filteredQuestions = computed(() => {
  if (!searchKeyword.value) return questions.value;
  const keyword = searchKeyword.value.toLowerCase();
  return questions.value.filter(q => 
    q.content.toLowerCase().includes(keyword) ||
    q.category.toLowerCase().includes(keyword) ||
    q.tags.some(tag => tag.toLowerCase().includes(keyword))
  );
});

// 弹窗状态
const showModal = ref(false);
const isEdit = ref(false);

// 表单数据
const formData = ref<QuestionForm>({
  content: '',
  category: '',
  tags: [],
  answer: '',
  application_scenarios: '',
  code_example: '',
  advanced_understanding: '',
  notes: '',
  parent_id: null
});

// 新标签输入
const newTag = ref('');

// 生成 UUID（符合 RFC 4122 标准）
const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// 获取问题列表
const loadQuestions = async () => {
  try {
    const data = await getAllQuestionsFromTable();
    questions.value = data || [];
  } catch (error) {
    console.error('加载问题失败:', error);
    uni.showToast({ title: '加载失败', icon: 'error' });
  }
};

// 搜索
const handleSearch = () => {
  // 搜索逻辑已在 computed 中实现
};

// 显示添加弹窗
const showAddModal = () => {
  isEdit.value = false;
  formData.value = {
    content: '',
    category: '',
    tags: [],
    answer: '',
    application_scenarios: '',
    code_example: '',
    advanced_understanding: '',
    notes: '',
    parent_id: null
  };
  showModal.value = true;
};

// 显示编辑弹窗
const showEditModal = (question: any) => {
  isEdit.value = true;
  formData.value = {
    id: question.id,
    content: question.content || '',
    category: question.category || '',
    tags: question.tags || [],
    answer: question.answer || '',
    application_scenarios: question.application_scenarios || '',
    code_example: question.code_example || '',
    advanced_understanding: question.advanced_understanding || '',
    notes: question.notes || '',
    parent_id: question.parent_id || null
  };
  showModal.value = true;
};

// 关闭弹窗
const closeModal = () => {
  showModal.value = false;
};

// 添加标签
const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !formData.value.tags.includes(tag) && formData.value.tags.length < 10) {
    formData.value.tags.push(tag);
    newTag.value = '';
  }
};

// 标签输入处理（按分号分割）
const onTagInput = () => {
  const inputValue = newTag.value;
  if (inputValue.includes(';')) {
    const tags = inputValue.split(';').map(t => t.trim()).filter(t => t);
    tags.forEach(tag => {
      if (!formData.value.tags.includes(tag) && formData.value.tags.length < 10) {
        formData.value.tags.push(tag);
      }
    });
    newTag.value = '';
  }
};

// 移除标签
const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1);
};

// 表单验证
const validateForm = (): boolean => {
  if (!formData.value.content.trim()) {
    uni.showToast({ title: '请输入问题内容', icon: 'none' });
    return false;
  }
  if (!formData.value.category.trim()) {
    uni.showToast({ title: '请输入分类', icon: 'none' });
    return false;
  }
  if (!formData.value.answer.trim()) {
    uni.showToast({ title: '请输入回答内容', icon: 'none' });
    return false;
  }
  return true;
};

// 提交表单
const submitForm = async () => {
  if (!validateForm()) return;

  try {
    // 构建数据（严格匹配数据库表结构）
    const questionData = {
      id: formData.value.id || generateId(),
      content: formData.value.content.trim(),
      category: formData.value.category,
      tags: formData.value.tags.length > 0 ? formData.value.tags : null,
      answer: formData.value.answer.trim() || null,
      application_scenarios: formData.value.application_scenarios.trim() || null,
      code_example: formData.value.code_example.trim() || null,
      advanced_understanding: formData.value.advanced_understanding.trim() || null,
      notes: formData.value.notes.trim() || null,
      parent_id: formData.value.parent_id || null,
      is_recommended: false
    };

    if (isEdit.value) {
      // 更新现有问题到数据库
      await updateQuestionInTable(questionData.id, questionData);
      // 更新本地列表
      const index = questions.value.findIndex(q => q.id === questionData.id);
      if (index >= 0) {
        questions.value[index] = questionData;
      }
      uni.showToast({ title: '更新成功', icon: 'success' });
    } else {
      // 添加新问题到数据库
      const result = await insertQuestionToTable(questionData);
      // 添加到本地列表
      questions.value.unshift(result || questionData);
      uni.showToast({ title: '添加成功', icon: 'success' });
    }

    closeModal();
  } catch (error) {
    console.error('保存失败:', error);
    uni.showToast({ title: '保存失败', icon: 'error' });
  }
};

// 删除问题
const deleteQuestion = (id: string) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个问题吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          // 从数据库删除
          await deleteQuestionFromTable(id);
          // 更新本地列表
          const index = questions.value.findIndex(q => q.id === id);
          if (index >= 0) {
            questions.value.splice(index, 1);
          }
          uni.showToast({ title: '删除成功', icon: 'success' });
        } catch (error) {
          console.error('删除失败:', error);
          uni.showToast({ title: '删除失败', icon: 'error' });
        }
      }
    }
  });
};

// 页面加载
onMounted(async () => {
  await loadQuestions();
});
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-container {
  min-height: 100vh;
  background-color: $bg;
}

.header {
  background-color: $card;
  padding: $spacing-lg;
  padding-top: calc($spacing-lg + constant(safe-area-inset-top));
  padding-top: calc($spacing-lg + env(safe-area-inset-top));
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid $border;
}

.title {
  font-size: $font-xl;
  font-weight: 600;
  color: $text-primary;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: $bg;
  border-radius: $radius-md;
  padding: $spacing-sm $spacing-md;
  flex: 1;
  max-width: 300rpx;
}

.search-icon {
  font-family: 'uniicons';
  font-size: $font-md;
  color: $text-muted;
  margin-right: $spacing-sm;
}

.search-input {
  flex: 1;
  font-size: $font-sm;
  background: transparent;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  background-color: $primary;
  color: #FFFFFF;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  font-size: $font-sm;
  
  .add-icon {
    font-family: 'uniicons';
    font-size: $font-md;
  }
}

.question-list {
  padding: $spacing-lg;
}

.question-item {
  background-color: $card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border: 1rpx solid $border;
}

.question-content {
  flex: 1;
}

.question-text {
  font-size: $font-md;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.5;
  display: block;
  margin-bottom: $spacing-sm;
}

.question-meta {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

.category-tag {
  background-color: $primary-light;
  color: $primary;
  padding: 4rpx 16rpx;
  border-radius: $radius-sm;
  font-size: $font-xs;
}

.tags-wrap {
  display: flex;
  gap: $spacing-xs;
  flex-wrap: wrap;
}

.tag {
  background-color: $bg;
  color: $text-secondary;
  padding: 4rpx 12rpx;
  border-radius: $radius-sm;
  font-size: $font-xs;
}

.question-actions {
  display: flex;
  gap: $spacing-sm;
  margin-left: $spacing-md;
}

.action-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'uniicons';
  font-size: $font-lg;
  
  &.edit {
    background-color: $primary-light;
    color: $primary;
  }
  
  &.delete {
    background-color: #FFEBEB;
    color: #E74C3C;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xxl * 2;
  
  .empty-icon {
    font-family: 'uniicons';
    font-size: 120rpx;
    color: $text-muted;
    margin-bottom: $spacing-lg;
  }
  
  .empty-text {
    font-size: $font-md;
    color: $text-muted;
  }
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-height: 85vh;
  background-color: $card;
  border-radius: $radius-lg $radius-lg 0 0;
  display: flex;
  flex-direction: column;
  z-index: 1001;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 1rpx solid $border;
}

.modal-title {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
}

.modal-close {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'uniicons';
  font-size: $font-xl;
  color: $text-muted;
}

.modal-body {
  flex: 1;
  padding: $spacing-lg;
  overflow-y: auto;
}

.form-item {
  margin-bottom: $spacing-lg;
}

.form-label {
  display: block;
  font-size: $font-sm;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  
  &::after {
    content: '';
    display: inline;
  }
}

.form-textarea {
  width: 100%;
  padding: $spacing-md;
  background-color: $bg;
  border: 1rpx solid $border;
  border-radius: $radius-md;
  font-size: $font-sm;
  line-height: 1.5;
  min-height: 120rpx;
  
  &.large {
    min-height: 200rpx;
  }
  
  &.code {
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: $font-xs;
  }
}

.form-hint {
  display: block;
  font-size: $font-xs;
  color: $text-muted;
  margin-top: $spacing-xs;
}

.form-input {
  width: 100%;
  padding: $spacing-md;
  background-color: $bg;
  border: 1rpx solid $border;
  border-radius: $radius-md;
  font-size: $font-sm;
  line-height: 1.5;
}

.category-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-top: $spacing-sm;
}

.suggestion-tag {
  background-color: $primary-light;
  color: $primary;
  padding: 6rpx 16rpx;
  border-radius: $radius-sm;
  font-size: $font-xs;
  cursor: pointer;
  
  &:active {
    opacity: 0.7;
  }
}

.select-wrapper {
  background-color: $bg;
  border: 1rpx solid $border;
  border-radius: $radius-md;
  overflow: hidden;
}

.select-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  font-size: $font-sm;
  color: $text-primary;
}

.select-arrow {
  font-family: 'uniicons';
  font-size: $font-md;
  color: $text-muted;
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  padding: $spacing-sm;
  background-color: $bg;
  border: 1rpx solid $border;
  border-radius: $radius-md;
  min-height: 80rpx;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  background-color: $primary-light;
  color: $primary;
  padding: 6rpx 12rpx;
  border-radius: $radius-sm;
  font-size: $font-xs;
}

.tag-remove {
  font-family: 'uniicons';
  font-size: $font-sm;
}

.tag-input {
  flex: 1;
  min-width: 150rpx;
  font-size: $font-sm;
  background: transparent;
}

.modal-footer {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg;
  border-top: 1rpx solid $border;
}

.btn {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-md;
  font-size: $font-md;
  font-weight: 500;
  
  &.btn-cancel {
    background-color: $bg;
    color: $text-secondary;
  }
  
  &.btn-confirm {
    background-color: $primary;
    color: #FFFFFF;
  }
}
</style>