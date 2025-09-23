<template>
  <div class="interview-questions">
    <!-- 页面头部 -->
    <QuestionHeader
      title="Vite.js 知识库"
      subtitle="Vite.js 是一个基于 Vue.js 的构建工具，它提供了快速的开发服务器和强大的构建功能。"
    />
    <!-- 搜索和筛选 -->
    <QuestionSearch @search="filteredQuestions" :categories="categories" />
    <!-- 题目列表 -->
    <QuestionCard v-for="(question, index) in questions" :key="index" :question="question" />
    <!-- 空状态 -->
    <div v-if="questions.length === 0" class="empty-state">
      <p>没有找到匹配的题目</p>
    </div>
  </div>
</template>

<script setup lang="ts" name="vite-repository">
import QuestionHeader from "../components/QuestionHeader.vue";
import QuestionSearch from "../components/QuestionSearch.vue";
import { useHandleQuestion } from "../hooks";
import QuestionCard from "../components/QuestionCard/index.vue";
const { filteredQuestions, questions, getQuestionsList, categories } = useHandleQuestion("vite");
</script>
<style>
@import "../page.css";
</style>
