<template>
  <!-- <Model /> -->
  <router-view></router-view>
</template>

<script setup lang="ts" name="App">
// import Model from '@/components/model/three/index.vue'
import { defineAsyncComponent } from 'vue'
const Model = defineAsyncComponent(
  () => import('./components/model/babylon/index.vue')
)
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
