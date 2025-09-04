<template>
  <template v-for="subItem in menuList" :key="subItem.path">
    <el-sub-menu v-if="subItem.children?.length" :expand-close-icon="CaretBottom" :expand-open-icon="CaretTop"
      :index="subItem.path">
      <template #title>
        <svg-icon v-if="subItem.meta.icon" :icon-style="iconStyle" :name="subItem.meta.icon" />
        <span class="sle ml12">{{ subItem.meta.title }}</span>
      </template>
      <SubMenu :menu-list="subItem.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="subItem.path" @click="handleClickMenu(subItem)">
      <svg-icon v-if="subItem.meta.icon" :icon-style="iconStyle" :name="subItem.meta.icon" />
      <template #title>
        <span class="sle ml12">{{ subItem.meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { ElSubMenu } from "element-plus";
import { CaretBottom, CaretTop } from "@element-plus/icons-vue"
import { iconStyle } from "./op"
defineProps<{ menuList: Menu.MenuOptions[] }>();
const router = useRouter();
const handleClickMenu = (subItem: Menu.MenuOptions) => {
  if (subItem.meta.isLink) return window.open(subItem.meta.isLink, "_blank");
  router.push(subItem.path);
};
</script>

<style lang="scss">
@use "./SubMenu.scss";
</style>
