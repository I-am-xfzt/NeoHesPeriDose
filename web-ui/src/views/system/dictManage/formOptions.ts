import { allElFormItemsOptions, loadComOptions } from "@/utils/loadComOptions";

const getElCom = new allElFormItemsOptions(),
  getElComOption = new loadComOptions(),
  defaultColum = (): Array<elComAttrAndFunType[]> => [
    [
      getElCom.getInput(
        {
          span: 6
        },
        {
          label: "搜索字典值",
          prop: "label",
        }
      ),
      getElCom.getSelect(
        {
          span: 6,
          dict: "dict_list",
          clearable: false
        },
        {
          label: "切换字典类型",
          prop: "dict"
        }
      ),
      {
        formItem: {
          prop: "btn"
        },
        slot: "operation",
        span: 5
      }
    ]
  ];
export default {
  form: getElComOption.getFormOptions({
    labelWidth: "90px"
  }),
  countInter: getElComOption.countInter(defaultColum()),
  dicts: getElComOption.countDict(defaultColum()),
  columns: defaultColum()
} as FyhComOptions;
