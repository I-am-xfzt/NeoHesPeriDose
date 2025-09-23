const minWidth = 120;

export default [
  {
    label: "序号",
    type: "index",
    width: 80,
    prop: "index"
  },
  {
    label: "文件名",
    prop: "name",
    minWidth: 200,
    com: {
      name: "span"
    }
  },
  {
    label: "文件大小",
    prop: "size",
    minWidth: 120,
    formatter: (row: any) => {
      const size = row.size;
      if (size === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(size) / Math.log(k));
      
      return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  },
  {
    label: "文件类型",
    prop: "type",
    minWidth: 100,
    com: {
      name: "el-tag",
      attrs: {
        type: "info",
        size: "small"
      }
    }
  },
  {
    label: "文件路径",
    prop: "path",
    minWidth: 200,
    com: {
      name: "span"
    }
  },
  {
    label: "上传状态",
    prop: "status",
    minWidth: 100,
    slots: "status"
  },
  {
    label: "上传进度",
    prop: "progress",
    minWidth: 180,
    slots: "progress"
  },
  {
    label: "操作",
    prop: "operation",
    width: 200,
    slots: "operation"
  }
] as tableColumnOp[];