const minWidth = 120;
export default [
  {
    label: "序号",
    type: "index",
    width: 80
  },
  {
    label: "菜单名称",
    minWidth,
    slots: 'svgIcon',
    formatter: (row) => (row["meta"] && row["meta"]?.title) || "",
  },
  {
    label: "路由路径",
    prop: "component",
    minWidth,
    formatter: (row) => ((row?.component ?? row?.redirect)) || "",
  },
  {
    label: "排序",
    type: "index",
    minWidth
  },
  {
    label: "权限标识",
    prop: "postList",
    minWidth,
    formatter: (row: any) => (row["meta"] && row["meta"]?.roles) || "",
    methods: {
      event: "click",
      name: "handleClick"
    }
  },
  {
    label: "类型",
    prop: "",
    minWidth,
    com: {
      name: "el-tag",
      attrs: {
        type: "success"
      }
    },
    formatter: (row: any) => "菜单"
  },
  {
    width: 280,
    label: "操作",
    slots: "operation"
  }
] as tableColumnOp[];
