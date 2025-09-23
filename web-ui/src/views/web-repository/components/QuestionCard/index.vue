<template>
  <main class="main-content">
    <div class="question">
      <div class="question-card rounded-8 mt10">
        <div class="question-header flx-between s-col-center">
          <h3 class="question-title">{{ question.title }}</h3>
          <span class="question-category">{{ question.category }}</span>
        </div>
        <div class="question-content pt20 pb20 pl20 pr20">
          <div v-html="formatMarkdown(question.content)"></div>
        </div>
        <div class="answer-section" v-if="isExpanded">
          <h4>答案：</h4>
          <div v-html="formatMarkdown(question.answer)"></div>
        </div>
        <div class="question-footer flx-between s-col-center">
          <div class="flx-align-center gap-10">
            <button @click="toggleAnswer" class="toggle-btn rounded-4 hand">
              {{ isExpanded ? "收起" : "查看答案" }}
            </button>
            <button v-if="question.code" @click="showCodeModal" class="code-btn rounded-4 hand">查看代码示例</button>
          </div>
          <div class="question-meta flx-align-center gap-12">
            <span class="difficulty" :class="question.difficulty">
              {{ question.difficulty }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- 代码示例弹窗 -->
  <div v-if="showCode" class="modal-overlay l-t-center" @click="closeCodeModal">
    <div class="code-modal rounded-8" @click.stop>
      <div class="modal-header FlexBox flx-between">
        <h3>代码示例</h3>
        <button class="close-btn rounded-4 hand l-t-center" @click="closeCodeModal">×</button>
      </div>
      <div class="modal-body scroll-y">
        <pre cols="scroll-x"><code class="language-javascript">{{ question.code }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="QuestionCard">
// 题目类型定义
export interface InterviewQuestion {
  title: string;
  category: string;
  content: string;
  answer: string;
  code?: string;
  difficulty: "初级" | "中级" | "高级";
}

// 接收题目数据作为props
const props = defineProps<{
  question: InterviewQuestion;
}>();

// 控制答案的展开/收起状态
const isExpanded = ref(false);

// 控制代码弹窗显示
const showCode = ref(false);

// 切换答案显示
const toggleAnswer = () => {
  isExpanded.value = !isExpanded.value;
};

// 显示代码弹窗
const showCodeModal = () => {
  showCode.value = true;
};

// 关闭代码弹窗
const closeCodeModal = () => {
  showCode.value = false;
};

// 简单的markdown格式化
const formatMarkdown = (text: string) => {
  return text
    .replace(/\n\n/g, "<br><br>")
    .replace(/^\d+\.\s+/gm, "<li>")
    .replace(/\n(?=\d+\.\s+|$)/gm, "</li>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^\s*\n/g, "");
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
