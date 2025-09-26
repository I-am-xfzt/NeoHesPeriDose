<template>
  <div class="interview-questions page-container">
    <div class="interview-questions-content">
      <!-- 页面头部 -->
      <QuestionHeader
        title="JavaScript 知识库"
        subtitle="JavaScript 是一种动态类型的、解释型的、基于原型的语言，广泛用于 Web 开发。"
      />
      <!-- 搜索和筛选 -->
      <QuestionSearch @search="filteredQuestions" @add-question="addQuestion" :categories="[insert, ...js_repository_tag]" />
      <!-- 题目列表 -->
      <QuestionCard v-for="(question, index) in questions" :key="index" :question="question" />
      <!-- 空状态 -->
      <div v-if="questions.length === 0" class="empty-state">
        <p>暂无匹配的题目</p>
      </div>
    </div>
    <theDialog v-if="visible" v-model:visible="visible" title="添加Js题目" @confirm="confirmHandleQuestion" @cancel="resetForm">
      <fyh-form ref="formRef" v-model="state.questionForm" :module-path="modulePath"></fyh-form>
    </theDialog>
    <the-pagination
      v-show="state.pagination?.total! > 0"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      v-bind="state.pagination"
    />
  </div>
</template>
<script setup lang="ts" name="js-repository">
import QuestionHeader from "../components/QuestionHeader.vue";
import QuestionSearch from "../components/QuestionSearch/index.vue";
import { useHandleQuestion } from "../hooks";
import QuestionCard from "../components/QuestionCard/index.vue";
import theDialog from "@/components/Dialog/index.vue";
import { useDict } from "@/hooks/dict";
const {
  filteredQuestions,
  insert,
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
  currentChangeHandle
} = useHandleQuestion("js");
const { js_repository_tag } = useDict("js_repository_tag");
</script>
<style>
@import "../page.css";
</style>
