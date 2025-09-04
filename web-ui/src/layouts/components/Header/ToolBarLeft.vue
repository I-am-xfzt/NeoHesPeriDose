<template>
  <div class="tool-bar-lf FlexBox">
    <Horizontal />
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/stores/modules/global";
import Horizontal from "./Horizontal.vue";
const globalStore = useGlobalStore();
</script>

<style scoped lang="scss">
.tool-bar-lf {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
}
</style>
