<template>
  <!-- <dv-border-box-1> -->
  <div id="modelContainer">
    <!-- <dv-decoration-9 style="width:150px; height:150px;">66%</dv-decoration-9> -->
    <div id="progress-text">{{progress}}</div>
  </div>
  <!-- </dv-border-box-1> -->
</template>
    
<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { initThree, ThreeModel } from './loadModel'
const model = new ThreeModel(
  [1, 1, 1],
  [0.9834125481551991, 0, -4.034512738720341],
  'modelContainer'
)
const progress = ref<number>(0)
onMounted(() => {
  model.init(({ loaded, total }) => {
    progress.value = (loaded / total) * 100
  })
  model.loadModel(() => {}, '氛围建筑2.glb',false)
})
</script>
    
<style>
#modelContainer {
  width: 100%;
  height: 100%;
}
#progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}
</style>