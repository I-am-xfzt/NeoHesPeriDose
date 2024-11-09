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
        [-1.4149514437369501, 49.99277517400039, 1.0680686465713172],
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