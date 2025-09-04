<script setup lang="ts" name="accountManage">
import FyhForm from "@/components/FyhComs/FyhForm.vue";
import FyhTable from "@/components/FyhComs/FyhTable.vue";
import { useTable, BasicTableProps } from "@/hooks/tablePage";
import { pageList } from "@/api/admin/accountManage";
const modelPath = `views/system/accountManage`;
import { Refresh, Search, EditPen, Delete } from "@element-plus/icons-vue";
const state = reactive<BasicTableProps>({
  queryForm: {
    status: undefined,
    username: "",
    phonenumber: ""
  },
  pageList
});
const { getDataList, resetData, tableStyle, currentChangeHandle, sizeChangeHandle } = useTable(state);
const { cellFunStyle, headerCellStyle, rowStyle } = tableStyle(8);
const openDialog = (id: number) => {};
const handleDelete = (id: number) => {
  state.dataList = state.dataList!.filter(item => item.id !== id);
};
</script>
<template>
  <div class="page-container">
    <fyh-form :module-path="modelPath" v-model="state.queryForm">
      <template #operation>
        <el-button type="primary" :icon="Search" @click="getDataList()">查询</el-button>
        <el-button :icon="Refresh" @click="resetData(true)">重置</el-button>
        <slot name="btns" />
      </template>
    </fyh-form>
    <fyh-table
      v-chartLoading="{ loading: state.loading, time: 500 }"
      :data="state.dataList"
      :cell-style="cellFunStyle"
      :header-cell-style="headerCellStyle"
      :row-style="rowStyle"
      :module-path="modelPath"
    >
      <template #operation="scope">
        <!-- 修改信息 -->
        <el-button :icon="EditPen" text type="primary" @click="openDialog(scope.row.userId)"> 修改 </el-button>
        <!-- 删除用户 -->
        <el-button
          :icon="Delete"
          :disabled="scope.row.username === 'admin'"
          text
          type="primary"
          @click="handleDelete(scope.row.userId)"
          >删除
        </el-button>
      </template>
    </fyh-table>
    <the-pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
  </div>
</template>
