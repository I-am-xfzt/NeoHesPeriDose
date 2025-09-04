<template>
  <div class="system-menu-container layout-pd">
    <el-card shadow="hover">
      <div class="system-menu-search mb15">
        <el-input size="default" placeholder="请输入菜单名称" style="max-width: 180px"> </el-input>
        <el-button size="default" type="primary" class="ml10">
          <el-icon>
            <ele-Search />
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddMenu">
          <el-icon>
            <ele-FolderAdd />
          </el-icon>
          新增菜单
        </el-button>
      </div>
      <el-table
        :data="state.tableData.data"
        v-loading="state.tableData.loading"
        style="width: 100%"
        row-key="path"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="菜单名称" show-overflow-tooltip>
          <template #default="scope">
            <SvgIcon :name="scope.row.meta.icon" />
            <span class="ml10">{{ $t(scope.row.meta.title) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" show-overflow-tooltip></el-table-column>
        <el-table-column label="组件路径" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.component }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限标识" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.meta.roles }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" show-overflow-tooltip width="80">
          <template #default="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="类型" show-overflow-tooltip width="80">
          <template #default="scope">
            <el-tag type="success">{{ scope.row.xx }}菜单</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="140">
          <template #default="scope">
            <el-button text type="primary" @click="onOpenAddMenu('add')">新增</el-button>
            <el-button text type="primary" @click="onOpenEditMenu('edit', scope.row)">修改</el-button>
            <el-button text type="primary" @click="onTabelRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <handleDialog ref="menuDialogRef" @refresh="getDataList()" />
  </div>
</template>

<script setup lang="ts" name="systemMenu">
import { useMessage, useMessageBox } from "@/hooks/message";
import { getAuthMenuListApi as pageList } from "@/api/login";
import { useTable, BasicTableProps } from "@/hooks/tablePage"
// 引入组件
const handleDialog = defineAsyncComponent(() => import("./handleModal.vue"));
const menuDialogRef = ref<InstanceType<typeof handleDialog>>();
const state = reactive<BasicTableProps>({
    pageList
});
const { getDataList } = useTable(state);
// 打开新增菜单弹窗
const onOpenAddMenu = (type: string) => {
  menuDialogRef.value!.openDialog(type);
};
// 打开编辑菜单弹窗
const onOpenEditMenu = (type: string, row: Menu.MenuOptions) => {
  menuDialogRef.value!.openDialog(type, row);
};
// 删除当前行
const onTabelRowDel = (row: Menu.MenuOptions) => {
  useMessageBox()
    .confirm(`此操作将永久删除路由：${row.path}, 是否继续?`, {
      confirmButtonText: "删除"
    })
    .then(() => {
      useMessage().success("删除成功");
      getDataList();
    })
    .catch(() => {});
};
</script>
