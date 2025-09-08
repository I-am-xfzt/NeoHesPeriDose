import { allElFormItemsOptions, loadComOptions } from "@/utils/loadComOptions";

const getElCom = new allElFormItemsOptions(),
  getElComOption = new loadComOptions(),
  defaultColum = (): Array<elComAttrAndFunType[]> => [
    [
      getElCom.getSelect({
        span: 12,
        label: "源坐标系",
        prop: "sourceSystem"
        // options: [
        //   { label: "WGS84", value: "wgs84" },
        //   { label: "GCJ02", value: "gcj02" },
        //   { label: "BD09", value: "bd09" }
        // ]
      }),
      getElCom.getSelect({
        span: 12,
        label: "目标坐标系",
        prop: "targetSystem"
        // options: [
        //   { label: "WGS84", value: "wgs84" },
        //   { label: "GCJ02", value: "gcj02" },
        //   { label: "BD09", value: "bd09" }
        // ]
      })
    ],
    [
      getElCom.getInput({
        span: 12,
        label: "源坐标",
        prop: "inputCoordinates"
      }),
      getElCom.getInput({
        span: 12,
        label: "目标坐标",
        prop: "outputCoordinate",
        disabled: true
      })
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
