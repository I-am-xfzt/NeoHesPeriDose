<template>
  <canvas id="babylonContainer"></canvas>
</template>
    
<script setup lang='ts'>
import { onMounted, ref, nextTick } from 'vue'
import { BabyLonModel } from './loadModel'
const modelValue = ref<BabyLonModel>()
onMounted(() =>
  nextTick(
    () => (
      (modelValue.value = new BabyLonModel(
        [ 0, 0, 0],
        'babylonContainer'
      )),
      modelValue.value.init()
    )
  )
)
</script>
    
<style>
#babylonContainer {
  width: 100%;
  height: 100%;
}
</style>