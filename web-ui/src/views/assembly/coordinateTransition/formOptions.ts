import { allElFormItemsOptions, loadComOptions } from "@/utils/loadComOptions";

const getElCom = new allElFormItemsOptions(),
  getElComOption = new loadComOptions(),
  defaultColum = (): Array<elComAttrAndFunType[]> => [
    [
      getElCom.getSelect({
        span: 12,
        label: "源坐标系",
        prop: "sourceSystem",
        dict: 'coordinate_type',
      }),
      getElCom.getSelect({
        span: 12,
        label: "目标坐标系",
        prop: "targetSystem",
        dict: 'coordinate_type'
      })
    ],
    [
      getElCom.getInput({
        span: 12,
        label: "源坐标X",
        prop: "inputX"
      }),
      getElCom.getInput({
        span: 12,
        label: "源坐标Y",
        prop: "inputY"
      })
    ]
  ];
export default {
  form: getElComOption.getFormOptions({
    labelWidth: "80px"
  }),
  rules: {},
  dicts: getElComOption.countDict(defaultColum()),
  columns: defaultColum()
} as FyhComOptions;
