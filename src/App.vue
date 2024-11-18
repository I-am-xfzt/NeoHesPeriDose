<template>
  <Model />
</template>

<script setup lang="ts" name="App">
// import Model from '@/components/model/three/index.vue'
import axios from 'axios'
import { defineAsyncComponent } from 'vue'
const Model = defineAsyncComponent(
  () => import('./components/model/babylon/index.vue')
)

axios.get('/json/modelinfo.json').then((res) => {})
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
