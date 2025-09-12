<template>
  <div class="wh100">
    <Model sliceParams="cloudsabovetexas/cloudsabovetexas.gltf" color="#1a2345" :modelPosition="modelPosition" />
  </div>
</template>

<script setup lang="ts">
const Model = defineAsyncComponent(() => import("@/components/model/three/index.vue"));
const modelPosition: Vector3Tuple[] = [[0, 10, 0]];
</script>

<style></style>
