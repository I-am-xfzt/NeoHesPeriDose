import { handleSearch } from "./components/tools";
import { ref, onMounted, reactive } from "vue";
import { useMessage } from "@/hooks/message";
import FyhForm from "@/components/FyhComs/FyhForm.vue";
import { Local } from "@/utils/storage";
import { Pagination } from "@/hooks/tablePage";
import { BaseHttpClient } from "@/utils/request";
interface BaseState {
  questionForm: Partial<InterviewQuestion>;
  pagination: Pagination;
  queryForm: {
    category: string;
    title: string;
  };
}
// 题目类型定义
export interface InterviewQuestion {
  title: string;
  category: string;
  content: string;
  answer: string;
  code?: string;
  difficulty: "初级" | "中级" | "高级";
}
const categoriesMaps = {
  ts: ["全部", "TypeScript基础", "类型系统", "接口与类型", "泛型", "装饰器", "模块与命名空间", "编译选项", "其他"],
  scss: ["全部", "SCSS基础", "变量", "嵌套", "混合宏", "继承", "函数", "编译选项"],
  vite: ["全部", "Vite基础", "插件系统", "配置选项", "环境变量", "静态资源处理", "热模块替换", "代码分割", "其他"]
};
const http = new BaseHttpClient("/");
export const useHandleQuestion = (path: string) => {
  const questions = ref<InterviewQuestion[]>([]);
  const formRef = ref<InstanceType<typeof FyhForm>>();
  const handleType = ref("");
  const state = reactive<BaseState>({
    queryForm: {
      category: "全部",
      title: ""
    },
    questionForm: {
      category: "",
      title: "",
      content: "",
      answer: "",
      code: "",
      difficulty: undefined
    },
    pagination: {
      current: 1,
      size: 10,
      total: 0,
      background: false,
      pageSizes: [1, 10, 20, 50, 100, 200],
      layout: "total, sizes, prev, pager, next, jumper"
    }
  });
  const filteredQuestions = (val: string, search: string) => {
    state.queryForm.category = val;
    state.queryForm.title = search;
    getQuestionsList();
  };
  const getQuestionsList = async () => {
    try {
      const response = await http.get<HttpResType<listResponse<InterviewQuestion>>>(`question/${path}-questions`, {
        current: state.pagination.current,
        size: state.pagination.size,
        ...state.queryForm
      });
      questions.value = response.data.data;
      state.pagination.total = response.data.total;
    } catch (error) {
      console.error(error);
    }
  };
  /**
   * 分页大小改变事件处理函数
   * @param val 新的分页大小
   */
  const sizeChangeHandle = (val: number) => {
    // 修改state.pagination中的size属性
    state.pagination!.size = val;
    // 再次发起查询操作
    getQuestionsList();
  };

  /**
   * 当前页码改变事件处理函数
   * @param val 新的页码
   */
  const currentChangeHandle = (val: number) => {
    // 修改state.pagination中的current属性
    state.pagination!.current = val;
    // 再次发起查询操作
    getQuestionsList();
  };
  const visible = ref(false);
  const addQuestion = (type: string, raw?: InterviewQuestion) => {
    handleType.value = type;
    Local.set("respository_tags", `${path}_repository_tag`);
    raw && (state.questionForm = raw)
    visible.value = true;
  };
  const confirmHandleQuestion = async () => {
    const valid = await formRef.value!.FyhFormRef!.validate();
    if (!valid) return;
    await http.post(`handle/question/${handleType.value}`, {
      fileName: `${path}-questions`,
      json:
        handleType.value === "add"
          ? state.questionForm
          : {
              key: "",
              value: state.questionForm
            }
    });
    useMessage().success("操作成功");
    resetForm();
    getQuestionsList();
  };
  // 重置表单
  const resetForm = () => {
    for (const key in state.questionForm) {
      state.questionForm[key as keyof InterviewQuestion] = undefined;
    }
  };
  onMounted(() => {
    getQuestionsList();
  });
  return {
    filteredQuestions,
    questions,
    getQuestionsList,
    visible,
    addQuestion,
    FyhForm,
    formRef,
    resetForm,
    state,
    confirmHandleQuestion,
    modulePath: "views/web-repository/components",
    sizeChangeHandle,
    currentChangeHandle,
    insert: { label: "全部", value: "全部" }
  };
};
