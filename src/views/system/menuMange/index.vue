<template>
  <div class="wh100">
     
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import authMenuList from "/json/authMenuList.json";

const proTable = ref();

const menuData = ref(authMenuList.data);

// 表格配置项
const columns = [
  { prop: "meta.title", label: "菜单名称", align: "left", search: { el: "input" } },
  { prop: "meta.icon", label: "菜单图标" },
  { prop: "name", label: "菜单 name", search: { el: "input" } },
  { prop: "path", label: "菜单路径", width: 300, search: { el: "input" } },
  { prop: "component", label: "组件路径", width: 300 },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];
</script>
