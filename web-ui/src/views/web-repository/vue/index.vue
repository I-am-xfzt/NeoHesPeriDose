<template>
  <div class="interview-questions page-container">
    <div class="interview-questions-content">
      <!-- 页面头部 -->
      <QuestionHeader />
      <!-- 搜索和筛选 -->
      <QuestionSearch @search="filteredQuestions" @addQuestion="addQuestion" :categories="[insert, ...vue_repository_tag]" />
      <!-- 题目列表 -->
      <QuestionCard v-for="(question, index) in questions" :key="index" :question="question" @updateQuestion="addQuestion" />
      <!-- 空状态 -->
      <div v-if="questions.length === 0" class="empty-state">
        <p>没有找到匹配的题目</p>
      </div>
    </div>
    <theDialog v-if="visible" v-model:visible="visible" title="添加Vue题目" @confirm="confirmHandleQuestion" @cancel="resetForm">
      <fyh-form ref="formRef" v-model="state.questionForm" :module-path="modulePath"></fyh-form>
    </theDialog>
    <the-pagination v-show="questions.length > 0" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
  </div>
</template>

<script setup lang="ts" name="vue-respository">
import QuestionCard from "../components/QuestionCard/index.vue";
import QuestionHeader from "../components/QuestionHeader.vue";
import QuestionSearch from "../components/QuestionSearch/index.vue";
import { useHandleQuestion } from "../hooks";
import theDialog from "@/components/Dialog/index.vue";
import { useDict } from "@/hooks/dict";
const {
  filteredQuestions,
  getQuestionsList,
  questions,
  addQuestion,
  visible,
  FyhForm,
  state,
  formRef,
  modulePath,
  confirmHandleQuestion,
  resetForm,
  sizeChangeHandle,
  currentChangeHandle,
  insert
} = useHandleQuestion("vue");
const { vue_repository_tag } = useDict("vue_repository_tag");
</script>

<style>
@import "../page.css";
</style>
