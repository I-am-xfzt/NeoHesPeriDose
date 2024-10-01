<template>
  <canvas id="babylonContainer"></canvas>
</template>
    
<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { BabyLonModel } from './loadModel'
const modelValue = ref<BabyLonModel>()
onMounted(
  () =>
    (modelValue.value = new BabyLonModel(
      [-17.996523113609623, 6.112156584599741, 6.065529508318049],
      'babylonContainer'
    ))
)
</script>
    
<style>
#babylonContainer{
    width: 100%;
    height: 100%;
}
</style>