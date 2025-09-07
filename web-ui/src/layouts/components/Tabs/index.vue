<template>
  <div class="tabs-box">
    <!-- <el-scrollbar ref="elMenuHorizontalScrollRef"> -->
      <div class="tabs-menu">
        <el-tag v-for="(item, i) in tabsMenuList" :class="{'tags-active': tabsMenuValue === item.path}" :key="item.path"
          :closable="item.close" @close="tabRemove(item.path)" @click="tabClick(item.path)">
          <div class="FlexBox hand gap-6">
            <svg-icon v-if="item.icon && tabsIcon"
              :icon-style="{width:`12px`, height:`12px`, fill: tabsMenuValue === item.path ? '#4a88f5' : '#7a85a4'}"
              :name="item.icon"></svg-icon>
            {{ item.title }}
          </div>
        </el-tag>
      </div>
    <!-- </el-scrollbar> -->
  </div>
</template>

<script setup lang="ts">
import Sortable from "sortablejs";
import { useGlobalStore } from "@/stores/modules/global";
import { useTabsStore } from "@/stores/modules/tabs";
import { useAuthStore } from "@/stores/modules/auth";
import { ElTag } from "element-plus";
const route = useRoute();
const router = useRouter();
const tabStore = useTabsStore();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const tabsMenuValue = ref(route.fullPath);
const tabsMenuList = computed(() => tabStore.tabsMenuList.filter(item => !item.path.includes('home/index')));
const tabsIcon = computed(() => globalStore.tabsIcon);

onMounted(() => {
  tabsDrop();
  initTabs();
});

// 监听路由的变化（防止浏览器后退/前进不变化 tabsMenuValue）
watch(
  () => route.fullPath,
  () => {
    console.log(tabsMenuList.value);
    
    if (route.meta.isFull && route.meta.isHide) return;
    tabsMenuValue.value = route.fullPath;
    const tabsParams = {
      icon: route.meta.icon as string,
      title: route.meta.title as string,
      path: route.fullPath,
      name: route.name as string,
      close: !route.meta.isAffix,
      isKeepAlive: route.meta.isKeepAlive as boolean
    };
    tabStore.addTabs(tabsParams);
  },
  { immediate: true }
);

// 初始化需要固定的 tabs
const initTabs = () => {
  authStore.flatMenuListGet.forEach(item => {
    if (item.meta.isAffix && !item.meta.isHide && !item.meta.isFull) {
      const tabsParams = {
        icon: item.meta.icon,
        title: item.meta.title,
        path: item.path,
        name: item.name,
        close: !item.meta.isAffix,
        isKeepAlive: item.meta.isKeepAlive
      };
      tabStore.addTabs(tabsParams);
    }
  });
};

// tabs 拖拽排序
const tabsDrop = () => {
  Sortable.create(document.querySelector(".tabs-menu") as HTMLElement, {
    draggable: ".el-tag",
    animation: 300,
    onEnd({ newIndex, oldIndex }) {
      const tabsList = [...tabStore.tabsMenuList];
      const currRow = tabsList.splice(oldIndex as number, 1)[0];
      tabsList.splice(newIndex as number, 0, currRow);
      tabStore.setTabs(tabsList);
    }
  });
};

// Tab Click
const tabClick = (fullPath: string) => {
  // authStore.setRouteName((route.meta.activeMenu ?? fullPath) as string);
  router.push(fullPath);
};

// Remove Tab
const tabRemove = (fullPath: string) => {
  tabStore.removeTabs(fullPath as string, fullPath == route.fullPath);
};
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
