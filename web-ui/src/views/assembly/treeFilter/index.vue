<template>
  <div class="content-box">
  </div>
</template>

<script setup lang="ts" name="treeFilter">
import { reactive } from "vue";
import { ElMessage } from "element-plus";

const treeFilterValue = reactive({ departmentId: "1" });
const changeTreeFilter = (val: string) => {
  ElMessage.success(`你选择了 id 为 ${val} 的数据🤔`);
  treeFilterValue.departmentId = val;
};

const treeFilterValue1 = reactive({ departmentId: ["11"] });
const changeTreeFilter1 = (val: string[]) => {
  ElMessage.success(`你选择了 id 为 ${JSON.stringify(val)} 的数据🤔`);
  treeFilterValue1.departmentId = val;
};
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
