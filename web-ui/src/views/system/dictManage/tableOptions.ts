import { parseTime } from "@/utils/formatTime"
const minWidth = 120;
export default [
  {
    label: "序号",
    type: "index",
    width: 80
  },
  {
    label: "字典类型",
    prop: "dictType",
    minWidth,
    com: {
      name: "el-tag",
      attrs: {
        type: "success"
      }
    }
  },
  {
    label: "标签名",
    prop: "label",
    minWidth
  },
  {
    label: "数据值",
    prop: "value",
    minWidth: 130
  },
  {
    label: "描述",
    prop: "description",
    minWidth,
    com: {
      name: "el-tag",
      attrs: {
        type: "primary"
      }
    }
  },
  {
    label: "备注",
    formatter: () => "-",
    minWidth
  },
  {
    label: "创建时间",
    formatter: ()=> parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
    minWidth
  },
  {
    width: 200,
    label: "操作",
    slots: "operation"
  }
] as tableColumnOp[];
