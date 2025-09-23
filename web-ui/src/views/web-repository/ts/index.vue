<template>
  <div class="interview-questions">
    <!-- 页面头部 -->
    <QuestionHeader title="TypeScript 知识库" subtitle="TypeScript 是一种静态类型的超集，它添加了可选的类型注解，帮助开发者在编译时捕获错误。"/>
    <!-- 搜索和筛选 -->
    <QuestionSearch @search="filteredQuestions" :categories="categories" />
    <!-- 题目列表 -->
    <div class="questions-list">
      <QuestionCard 
        v-for="(question, index) in questions" 
        :key="index"
        :question="question"
      />
      
      <!-- 空状态 -->
      <div v-if="questions.length === 0" class="empty-state">
        <p>暂无匹配的题目</p>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts' name="ts-repository">
import QuestionHeader from "../components/QuestionHeader.vue";
import QuestionSearch from "../components/QuestionSearch.vue";
import { useHandleQuestion } from "../hooks";
import QuestionCard from "../components/QuestionCard/index.vue";
const { filteredQuestions, questions, getQuestionsList, categories } = useHandleQuestion("ts");
</script>

<style>
@import "../page.css";
</style>