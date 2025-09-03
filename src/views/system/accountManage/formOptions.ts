import { allElFormItemsOptions, loadComOptions } from "@/utils/loadComOptions";

const getElCom = new allElFormItemsOptions(),
  getElComOption = new loadComOptions(),
  defaultColum = (): Array<elComAttrAndFunType[]> => [
    [
      getElCom.getInput({
        span: 4,
        label: "手机号",
        prop: "phonenumber"
      }),
      getElCom.getInput({
        label: "用户名",
        span: 4,
        prop: "username"
      }),
      getElCom.getSelect({
        label: "账号状态",
        span: 4,
        prop: "status",
        dict: 'account_status'
      }),
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
    labelWidth: "65px"
  }),
  rules: {},
  dicts: getElComOption.countDict(defaultColum()),
  columns: defaultColum()
} as FyhComOptions;
