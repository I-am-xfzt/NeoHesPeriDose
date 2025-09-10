const minWidth = 120;
export default [
  {
    label: "序号",
    type: "index",
    width: 80
  },
  {
    label: "图片名称",
    prop: "name",
    minWidth
  },
  {
    label: "图片大小",
    prop: "size",
    minWidth
  },
  {
    label: "图片类型",
    prop: "type",
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
