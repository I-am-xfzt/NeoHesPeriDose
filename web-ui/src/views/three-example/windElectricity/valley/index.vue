<template>
  <div class="page-container">
    <Model sliceParams="scene" color="#1a2345" :modelPosition="modelPosition" />
  </div>
</template>

<script setup lang="ts">
import Model from "@/components/model/three/index.vue";
const modelPosition: Vector3Tuple[] = [
  [0, 10, 0],
  [0, 10, 0]
];
const form = reactive({});
</script>

<style lang="scss" scoped></style>
