<template>
  <div class="page-container">
    <fyh-form :module-path="modelPath" v-model="state.queryForm" @handleChange="getDataList()">
      <template #operation>
        <el-button type="primary" :icon="Search" @click="getDataList()">查询</el-button>
        <el-button :icon="Refresh" @click="resetData(true, ()=>{
          state.queryForm.dict = 'js_repository_tag'
        })">重置</el-button>
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
        <el-button :icon="EditPen" text type="primary" @click="openDialog()"> 修改 </el-button>
        <!-- 删除用户 -->
        <el-button
          :icon="Delete"
          v-auth="'admin'"
          text
          type="primary"
          @click="handleDelete()"
          >删除
        </el-button>
      </template>
    </fyh-table>
    <the-pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
  </div>
</template>

<script setup lang="ts" name="dict-manage">
import FyhForm from "@/components/FyhComs/FyhForm.vue";
import FyhTable from "@/components/FyhComs/FyhTable.vue";
import { useTable, BasicTableProps } from "@/hooks/tablePage";
import { pageList } from "@/api/admin/dictManage";
const modelPath = `views/system/dictManage`;
import { Refresh, Search, EditPen, Delete } from "@element-plus/icons-vue";
const state = reactive<BasicTableProps>({
  queryForm: {
    dict: 'js_repository_tag',
    label: ''
  },
  pageList
});
const { getDataList, resetData, tableStyle, currentChangeHandle, sizeChangeHandle } = useTable(state);
const { cellFunStyle, headerCellStyle, rowStyle } = toRefs(reactive(tableStyle(8)));
const handleDelete = ()=>{}
const openDialog = ()=>{}
</script>
