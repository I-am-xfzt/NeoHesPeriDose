import { allElFormItemsOptions, loadComOptions } from "@/utils/loadComOptions";
const getElCom = new allElFormItemsOptions(),
  getElComOption = new loadComOptions(),
  defaultColum = (): Array<elComAttrAndFunType[]> => [
    [
      getElCom.getSelect(
        {
          span: 12,
          dict: "coordinate_type"
        },
        {
          required: true,
          prop: "sourceSystem",
          label: "源坐标系"
        }
      ),
      getElCom.getSelect(
        {
          span: 12,
          label: "目标坐标系",
          prop: "targetSystem",
          dict: "coordinate_type"
        },
        {
          required: true,
          prop: "targetSystem",
          label: "目标坐标系"
        }
      )
    ],
    [
      getElCom.getInput(
        {
          span: 12
        },
        {
          label: "源坐标经度",
          prop: "inputY",
          required: true
        }
      ),
      getElCom.getInput(
        {
          span: 12
        },
        {
          required: true,
          label: "源坐标纬度",
          prop: "inputX"
        }
      )
    ]
  ];
export default {
  form: getElComOption.getFormOptions({
    labelWidth: "90px"
  }),
  rules: (form: EmptyObjectType) =>
    getElComOption.createFormRules({
      sourceSystem: {
        rule: [
          "blur",
          undefined,
          undefined,
          (rule: any, value: any, callback: any) => {
            if (form.targetSystem === value) {
              callback(new Error("源坐标系不能和目标坐标系相同"));
            } else {
              callback();
            }
          }
        ]
      },
      targetSystem: {
        rule: [
          "blur",
          undefined,
          undefined,
          (rule: any, value: any, callback: any) => {
            if (form.sourceSystem === value) {
              callback(new Error("目标坐标系不能和源坐标系相同"));
            } else {
              callback();
            }
          }
        ]
      },
      inputX: {
        rule: ["blur", "请输入正确的源坐标经度", /^-?((1[0-7]\d|[0-9]?\d)(\.\d{1,6})?|180(\.0{1,12})?)$/]
      },
      inputY: {
        rule: ["blur", "请输入正确的源坐标纬度", /^-?([0-8]?\d(\.\d{1,12})?|90(\.0{1,12})?)$/]
      }
    }),
  dicts: getElComOption.countDict(defaultColum()),
  columns: defaultColum()
} as FyhComOptions;
