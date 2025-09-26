import { allElFormItemsOptions, loadComOptions } from "@/utils/loadComOptions";
import { Local } from "@/utils/storage"
const getElCom = new allElFormItemsOptions(),
  getElComOption = new loadComOptions(),
  defaultColum = (): Array<elComAttrAndFunType[]> => {
    const dict = Local.get('respository_tags')
    return [
      [
        getElCom.getInput(
          {
            span: 24
          },
          {
            label: "题目标题",
            prop: "title",
            required: true
          }
        ),
        getElCom.getSelect(
          {
            span: 24,
            dict
          },
          {
            required: true,
            label: "题目分类",
            prop: "category"
          }
        ),
        getElCom.getSelect(
          {
            span: 24,
            dict: "difficultyLevel",
            isInter: ["初级", "中级", "高级"].map(item => ({
              dict: "difficultyLevel",
              label: item,
              value: item
            }))
          },
          {
            required: true,
            label: "难度等级",
            prop: "difficulty"
          }
        ),
        getElCom.getInput(
          {
            span: 24
          },
          {
            required: true,
            label: "题目内容",
            prop: "content"
          }
        ),
        getElCom.getInput(
          {
            span: 24,
            type: "textarea",
            rows: 4
          },
          {
            required: true,
            label: "题目答案",
            prop: "answer"
          }
        ),
        getElCom.getInput(
          {
            span: 24,
            type: "textarea",
            rows: 6,
            placeholder: "请在编辑器复制您的代码并粘贴"
          },
          {
            required: false,
            label: "代码示例",
            prop: "code"
          }
        )
      ]
    ];
  };
export default {
  form: getElComOption.getFormOptions({
    labelWidth: "72px",
    size: 'default'
  }),
  rules: (form: EmptyObjectType) =>
    getElComOption.createFormRules({
      title: {
        rule: ["blur", "请输入题目标题"]
      },
      content: {
        rule: ["blur", "请输入题目内容"]
      },
      answer: {
        rule: ["blur", "请输入题目答案"]
      },
      category: {
        rule: ["change", "请选择题目分类"]
      },
      difficulty: {
        rule: ["change", "请选择题目难度"]
      }
    }),
  dicts: getElComOption.countDict(defaultColum()),
  countInter: getElComOption.countInter(defaultColum()),
  columns: defaultColum()
} as FyhComOptions;
