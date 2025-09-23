<template>
  <div class="interview-questions">
    <!-- 页面头部 -->
    <QuestionHeader />
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

<script setup lang="ts" name="vue-interview-questions">
import QuestionCard from "../components/QuestionCard/index.vue";
import QuestionHeader from "../components/QuestionHeader.vue";
import QuestionSearch from "../components/QuestionSearch.vue";
import { useHandleQuestion } from "../hooks";
import Pagination from "@/components/Pagination/index.vue";
const { filteredQuestions, getQuestionsList, questions, categories } = useHandleQuestion('vue');

</script>

<style>
@import "../page.css";
</style>
