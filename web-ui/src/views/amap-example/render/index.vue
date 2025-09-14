<template>
  <div class="page-container wh100">
    <el-alert
      title="简单地图渲染"
      type="primary"
      :closable="false"
      class="mb15"
    ></el-alert>
    <amapContainer v-bind="attrs" />
  </div>
</template>

<script setup lang="ts" name="render-example">
const amapContainer = defineAsyncComponent(() => import("@/components/aMapContainer/index.vue"));
const attrs = reactive({
  customFun: async () => {},
  mapStyle: "darkblue",
  viewMode: "2D" as "2D" | "3D",
  zoom: 13
});
</script>
