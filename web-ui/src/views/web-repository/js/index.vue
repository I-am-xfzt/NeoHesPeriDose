<template>
  <div class="interview-questions">
    <!-- 页面头部 -->
    <QuestionHeader
      title="JavaScript 知识库"
      subtitle="JavaScript 是一种动态类型的、解释型的、基于原型的语言，广泛用于 Web 开发。"
    />
    <!-- 搜索和筛选 -->
    <QuestionSearch @search="filteredQuestions" :categories="categories" />
    <!-- 题目列表 -->
    <div class="questions-list">
      <QuestionCard v-for="(question, index) in questions" :key="index" :question="question" />
      <!-- 空状态 -->
      <div v-if="questions.length === 0" class="empty-state">
        <p>暂无匹配的题目</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="js-repository">
import QuestionHeader from "../components/QuestionHeader.vue";
import QuestionSearch from "../components/QuestionSearch.vue";
import { useHandleQuestion } from "../hooks";
import QuestionCard from "../components/QuestionCard/index.vue";
const { filteredQuestions, questions, getQuestionsList, categories } = useHandleQuestion("js");
</script>
<style>
@import "../page.css";
</style>
