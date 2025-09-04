<template>
  <div class="tool-bar-ri FlexBox">
    <div class="header-icon FlexBox hand">
      <AssemblySize id="assemblySize" />
      <Language id="language" />
      <SearchMenu id="searchMenu" />
      <!-- <ThemeSetting id="themeSetting" /> -->
      <Message id="message" />
      <Fullscreen id="fullscreen" />
      <span class="username">{{ username }}</span>
    </div>
    <Avatar />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/modules/user";
import AssemblySize from "./components/AssemblySize.vue";
import Language from "./components/Language.vue";
import SearchMenu from "./components/SearchMenu.vue";
import ThemeSetting from "./components/ThemeSetting.vue";
import Message from "./components/Message.vue";
import Fullscreen from "./components/Fullscreen.vue";
import Avatar from "./components/Avatar.vue";

const userStore = useUserStore();
const username = computed(() => userStore.userInfo.userName);
</script>

<style scoped lang="scss">
.tool-bar-ri {
  padding-right: 25px;

  .header-icon {
    gap: 15px;

    & > div {
      height: 26px;
    }

    & > * {
      color: var(--el-color-active-primary);
    }
  }

  .username {
    margin: 0 10px;
    font-size: 15px;
    font-weight: bold;
    color: var(--el-color-active-primary);
  }
}
</style>
