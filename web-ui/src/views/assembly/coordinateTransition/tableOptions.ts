const minWidth = 120;
export default [
  {
    label: "序号",
    type: "index",
    width: 80
  },
  {
    label: "源坐标",
    prop: "source",
    minWidth
  },
  {
    label: "源坐标类型",
    prop: "sourceType",
    minWidth
  },
  {
    label: "目标坐标",
    prop: "target",
    minWidth
  },
  {
    label: "目标坐标类型",
    prop: "targetType",
    minWidth: 130
  },
  {
    label: "添加时间",
    prop: "createTime",
    minWidth
  },
  {
    width: 120,
    label: "操作",
    slots: "operation"
  }
] as tableColumnOp[];
