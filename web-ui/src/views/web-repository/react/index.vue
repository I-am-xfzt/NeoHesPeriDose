<template>
  <div class="interview-questions">
    <!-- 页面头部 -->
    <QuestionHeader title="React 知识库" subtitle="React 是一个用于构建用户界面的 JavaScript 库，由 Facebook 开发。" />
    <!-- 搜索和筛选 -->
    <QuestionSearch @search="filteredQuestions" :categories="categories" />
    <!-- 题目列表 -->
    <QuestionCard v-for="(question, index) in questions" :key="index" :question="question" />

    <!-- 空状态 -->
    <div v-if="questions.length === 0" class="empty-state">
      <p>暂无匹配的题目</p>
    </div>
  </div>
</template>

<script setup lang="ts" name="react-repository">
import QuestionHeader from "../components/QuestionHeader.vue";
import QuestionSearch from "../components/QuestionSearch.vue";
import { useHandleQuestion } from "../hooks";
import QuestionCard from "../components/QuestionCard/index.vue";
const { filteredQuestions, questions, getQuestionsList, categories } = useHandleQuestion("react");
</script>

<style>
@import "../page.css";
</style>
