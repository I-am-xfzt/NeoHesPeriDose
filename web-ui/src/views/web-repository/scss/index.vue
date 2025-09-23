<template>
    <div class="interview-questions">
        <!-- 页面头部 -->
        <QuestionHeader title="SCSS 知识库" subtitle="SCSS 是一种 CSS 预处理器，它添加了变量、嵌套规则、混合宏等功能，使 CSS 更加强大和可维护。"/>        <!-- 搜索和筛选 -->
        <QuestionSearch @search="filteredQuestions" :categories="categories" />
        <!-- 题目列表 -->
        <QuestionCard v-for="(question, index) in questions" :key="index" :question="question" />
        <!-- 空状态 -->
        <div v-if="questions.length === 0" class="empty-state">
            <p>没有找到匹配的题目</p>
        </div>
    </div>
</template>
  
<script setup lang='ts' name="scss-repository">
  import QuestionHeader from '../components/QuestionHeader.vue';
  import QuestionSearch from '../components/QuestionSearch.vue';
  import QuestionCard from '../components/QuestionCard/index.vue'
  import { useHandleQuestion } from '../hooks';
  const { filteredQuestions, questions, getQuestionsList, categories } = useHandleQuestion('scss');
</script>
  
<style>
  @import "../page.css";
</style>