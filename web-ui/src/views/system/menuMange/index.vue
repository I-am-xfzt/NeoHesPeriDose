<template>
  <div class="page-container">
    <div class="system-menu-search mb15">
      <el-input placeholder="请输入菜单名称" v-model="state.searchMenu" @keyup.enter.native="onSearchMenu"  style="max-width: 220px"> </el-input>
      <el-button :icon="Search" type="primary" class="ml10"> 查询 </el-button>
      <el-button :icon="FolderAdd" type="add" class="ml10" @click="onOpenAddMenu"> 新增菜单 </el-button>
    </div>
    <fyh-table
      :data="state.dataList"
      v-chartLoading="{ loading: state.loading, time: 500 }"
      row-key="path"
      :tree-props="{ children: 'children', hasChildren: 'children' }"
      :cell-style="{
        borderTop: `1px solid #4485b5`
      }"
      :header-cell-style="headerCellStyle"
      :module-path="`views/system/menuMange`"
    >
      <template #svgIcon="{ row }">
        <div class="FlexBox absolute posTCenter left-40 gap-10">
          <svg-icon
            :name="row.meta.icon"
            :icon-style="{
              width: '16px',
              height: '16px',
              fill: '#7a85a4'
            }"
          />
          {{ row.meta.title }}
        </div>
      </template>
      <template #operation="{ row }">
        <el-button :icon="Plus" text type="primary" @click="onOpenAddMenu('add')">新增</el-button>
        <el-button :icon="EditPen" text type="primary" @click="onOpenEditMenu('edit', row)">修改</el-button>
        <el-button :icon="Delete" text type="primary" @click="onTabelRowDel(row)">删除</el-button>
      </template>
    </fyh-table>
  </div>
</template>

<script setup lang="ts" name="systemMenu">
import { useMessage, useMessageBox } from "@/hooks/message";
import { pageList } from "@/api/admin/menu";
import { useTable, BasicTableProps } from "@/hooks/tablePage";
import FyhTable from "@/components/FyhComs/FyhTable.vue";
import { Delete, FolderAdd, Search, EditPen, Plus } from "@element-plus/icons-vue";
// 引入组件
const handleDialog = defineAsyncComponent(() => import("./handleModal.vue"));
const menuDialogRef = ref<InstanceType<typeof handleDialog>>();
const state = reactive<BasicTableProps<Menu.MenuOptions>>({
  pageList,
  searchMenu: ''
});
const { getDataList, tableStyle } = useTable(state);
const { headerCellStyle } = tableStyle();
// 打开新增菜单弹窗
const onOpenAddMenu = (type: string) => {
  menuDialogRef.value!.openDialog(type);
};
const onSearchMenu = ()=> {
  // state.dataList = state.dataList?.map
}
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
