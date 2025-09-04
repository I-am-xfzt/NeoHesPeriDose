<template>
  <div class="theme-setting pt4">
    <svg-icon name="theme" :icon-style="{ width: '20px', height: '20px', fill: '#4a88f5' }" @click="openDrawer" />
  </div>
</template>

<script setup lang="ts">
import mittBus from "@/utils/mittBus";
const openDrawer = () => {
  mittBus.emit("openThemeDrawer");
};
</script>
