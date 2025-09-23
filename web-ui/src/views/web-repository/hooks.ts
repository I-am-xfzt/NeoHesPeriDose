import { handleSearch } from "./components/tools";
import { ref, onMounted } from "vue";
import { InterviewQuestion } from "./components/QuestionCard/index.vue";
import { useMessage } from "@/hooks/message";
const categoriesMaps = {
  vue: ["全部", "Vue基础", "Vue3新特性", "组件通信", "生命周期", "Vuex", "Vue Router", "性能优化", "其他"],
  ts: ["全部", "TypeScript基础", "类型系统", "接口与类型", "泛型", "装饰器", "模块与命名空间", "编译选项", "其他"],
  js: ["全部", "JavaScript基础", "变量与数据类型", "运算符", "继承", "函数", "数组与对象", "ES6+新特性", "其他"],
  scss: ["全部", "SCSS基础", "变量", "嵌套", "混合宏", "继承", "函数", "编译选项"],
  vite: ["全部", "Vite基础", "插件系统", "配置选项", "环境变量", "静态资源处理", "热模块替换", "代码分割", "其他"],
  react: ["全部", "React基础", "组件", "状态管理", "路由", "React Hooks", "性能优化", "其他"]
};
export const useHandleQuestion = (path: string) => {
  const questions = ref<InterviewQuestion[]>([]);
  const filteredQuestions = (val: string, search: string) => {
    questions.value = handleSearch<InterviewQuestion>(questions.value, val, search);
  };
  const getQuestionsList = async () => {
    try {
      const response = await import(`./data/${path}-questions.json`);
      questions.value = response.default;
    } catch (error) {
      useMessage().error("加载题目数据失败，请稍后重试");
      console.error("加载题目数据失败:", error);
    }
  };
  onMounted(() => {
    getQuestionsList();
  });
  return {
    filteredQuestions,
    questions,
    getQuestionsList,
    categories: categoriesMaps[path]
  };
};
