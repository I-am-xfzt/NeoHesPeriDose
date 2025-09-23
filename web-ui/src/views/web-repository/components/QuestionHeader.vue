<template>
  <!-- 页面头部 -->
  <header class="header">
    <div class="container">
      <h1>{{ title }}</h1>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
  </header>
</template>

<script setup lang="ts" name="QuestionCardHeader">
const props = defineProps({
  title: {
    type: String,
    default: "Vue.js 面试题题库"
  },
  subtitle: {
    type: String,
    default: "全面整理的 Vue 相关面试题，涵盖基础到进阶的知识点"
  }
});
</script>

<style scoped lang="scss">
/* 头部 */
.header {
  background: linear-gradient(135deg, rgba(66, 184, 131, 0.9) 0%, rgba(53, 73, 94, 0.9) 100%);
  color: white;
  padding: 40px 0 30px;
  text-align: center;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  h1 {
    font-size: 2rem;
    margin-bottom: 8px;
    font-weight: 700;
  }

  .subtitle {
    font-size: 1rem;
    opacity: 0.9;
    max-width: 700px;
    margin: 0 auto;
  }
}
/* 响应式设计 */
@media (max-width: 768px) {
  .header h1 {
    font-size: 1.8rem;
  }
}
</style>
