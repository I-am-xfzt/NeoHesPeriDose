<template>
  <el-scrollbar style="width: 100%" @wheel.native.prevent="onElMenuHorizontalScroll" ref="elMenuHorizontalScrollRef">
    <el-menu mode="horizontal" :default-active="activeMenu">
      <el-menu-item
        v-for="subItem in menuList"
        :key="subItem.path + 'el-menu-item'"
        :index="subItem.path"
        @click="handleClickMenu(subItem)"
      >
        <svg-icon :name="subItem.meta.icon" :icon-style="iconStyle" />
        <template #title>
          <span class="ml10">{{ subItem.meta.title }}</span>
        </template>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts" name="Horizontal">
import { usePageTools } from "@/hooks/useTools";
import { useAuthStore } from "@/stores/modules/auth";
import { iconStyle } from "../Menu/op";
import { RouteLocationNormalizedGeneric } from "vue-router";
const route = useRoute();
const router = useRouter();
const { onElMenuHorizontalScroll } = usePageTools();
const authStore = useAuthStore();
const menuList = computed(() => authStore.authMenuListGet);
const activeMenu = ref<string>("/home/index");
const handleClickMenu = async (subItem: Menu.MenuOptions) => {
  if (subItem.meta.isLink) return window.open(subItem.meta.isLink, "_blank");
  await router.push(subItem.path);
};
const getActiveMenu = (routeInfo: RouteLocationNormalizedGeneric) => {
  /**
   * 通过路由路径查找最顶层对象的 path（递归版本）
   * @param routes 路由数组
   * @returns 最顶层对象的 path，如果未找到则返回 null
   */
  const findTopLevelPathRecursive = (routes: Menu.MenuOptions[], currentTopPath: string | null = null): string => {
    for (const item of routes) {
      const newTopPath = currentTopPath ?? item.path;
      // 如果找到目标路径，返回当前顶层路径
      if (item.path === routeInfo.path) {
        return newTopPath;
      }
      // 如果有子路由，递归查找
      if (item.children && item.children.length > 0) {
        const result = findTopLevelPathRecursive(item.children, newTopPath);
        if (result) {
          return result;
        }
      }
    }
    return "";
  };
  activeMenu.value = findTopLevelPathRecursive(menuList.value);
};
watch(
  () => activeMenu.value,
  path => {
    authStore.setRouteName(path);
  },
  { immediate: true }
);
onBeforeMount(() => {
  getActiveMenu(route);
});
// 路由更新时
onBeforeRouteUpdate(to => {
  getActiveMenu(to);
});
</script>

<style lang="scss" scoped>
:deep(.el-menu--horizontal) {
  border: none;
  background: transparent !important;
  height: fit-content;
  .el-menu-item {
    padding-top: 10px;

    &:hover {
      color: var(--el-color-active-primary);
    }

    &.is-active {
      border-bottom: 1px solid var(--el-color-active-primary) !important;
      color: var(--el-color-active-primary) !important;
      background-color: var(--el-menu-hover-bg-color) !important;
    }
  }
}
</style>
