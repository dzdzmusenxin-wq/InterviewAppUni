<template>
  <!-- mp-html 完美兼容 H5、小程序、App，支持丰富的 HTML 标签和样式 -->
  <mp-html
    :content="htmlContent"
    :tag-style="tagStyles"
    :lazy-load="true"
    :selectable="true"
    @linktap="handleLinkTap"
  />
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'mp-html/plugins/markdown/marked.min.js';
import MpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue';

const props = defineProps({
  markdown: {
    type: String,
    default: ''
  }
});

// 自定义一些美观的标签样式（比如代码块、表格、图片自适应）
const tagStyles = {
  h1: 'font-size: 22px; font-weight: 700; margin: 14px 0 10px; line-height: 1.35;',
  h2: 'font-size: 20px; font-weight: 700; margin: 14px 0 10px; line-height: 1.35;',
  h3: 'font-size: 18px; font-weight: 600; margin: 12px 0 8px; line-height: 1.35;',
  p: 'font-size: 15px; line-height: 1.75; margin: 8px 0; color: #334155;',
  ul: 'margin: 8px 0; padding-left: 20px;',
  ol: 'margin: 8px 0; padding-left: 20px;',
  li: 'font-size: 15px; line-height: 1.75; margin: 4px 0; color: #334155;',
  blockquote: 'border-left: 4px solid #CBD5E1; margin: 10px 0; padding: 6px 12px; background: #F8FAFC; color: #475569;',
  pre: 'background: #0F172A; color: #E2E8F0; padding: 12px; border-radius: 6px; overflow-x: auto; margin: 10px 0; line-height: 1.6;',
  code: 'font-family: monospace; background: #F1F5F9; color: #0F172A; padding: 2px 4px; border-radius: 4px;',
  img: 'max-width: 100% !important; height: auto !important; display: block;',
  table: 'width: 100%; border-collapse: collapse; margin: 10px 0;',
  th: 'border: 1px solid #ddd; padding: 8px; background: #f8f8f8;',
  td: 'border: 1px solid #ddd; padding: 8px;'
};

const stripUnsafeHtml = (html) => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+=(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    .replace(/\s(href|src)=["']javascript:[^"']*["']/gi, '');
};

const escapeHtml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>');
};

const htmlContent = computed(() => {
  if (!props.markdown) return '';

  try {
    const rawHtml = marked.parse(props.markdown, {
      breaks: true,
      gfm: true
    });

    return stripUnsafeHtml(rawHtml);
  } catch (error) {
    console.error('Markdown parse failed:', error);
    return `<p>${escapeHtml(props.markdown)}</p>`;
  }
});

// 处理链接点击（小程序和 App 端无法直接跳转，需要拦截处理）
const handleLinkTap = (e) => {
  console.log('点击了链接：', e.href);
  // 可以在这里调用 uni.navigateTo 或 uni.showModal 进行跳转拦截
};
</script>
