const minWidth = 120;
export default [
  {
    label: "序号",
    type: "index",
    width: 80
  },
  {
    label: "用户名",
    prop: "username",
    minWidth
  },
  {
    label: "姓名",
    prop: "name",
    minWidth
  },
  {
    label: "手机号",
    prop: "phone",
    minWidth: 130
  },
  {
    label: "岗位",
    prop: "postList",
    minWidth,
    com: {
      name: "el-tag",
      attrs: {
        type: "primary"
      }
    },
    formatter: (row: any) => (row["postList"] && row["postList"][0]?.postName) || "",
    methods: {
      event: "click",
      name: "handleClick"
    }
  },
  {
    label: "角色",
    prop: "roleList",
    minWidth,
    com: {
      name: "el-tag",
      attrs: {
        type: "primary"
      }
    },
    formatter: (row: any) => (row["roleList"] && row["roleList"][0]?.roleName) || ""
  },
  {
    label: "创建时间",
    prop: "createTime",
    minWidth
  },
  {
    label: "账号状态",
    prop: "lockFlag",
    minWidth,
    isTag: true,
    dict: "account_status"
  },
  {
    width: 200,
    label: "操作",
    slots: "operation"
  }
] as tableColumnOp[];
