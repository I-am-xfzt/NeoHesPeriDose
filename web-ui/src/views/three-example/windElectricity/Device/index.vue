<template>
  <!-- <Model ref="ModelRef" sliceParams="展开" :unLoad="unLoad" color="#02121f" :lightOptions="lightOptions"
                :scale="scale" :cameraPosition="cameraPosition" :modelPosition="modelPosition" :initGround="true" /> -->
  <div class="page-container">
    <TresCanvas class="wh100">
      <TresPerspectiveCamera :position="cameraPosition" :fov="50" :near="0.1" :far="10000" />
      <OrbitControls />
      <TresAmbientLight color="#ffffff" :intensity="1" />
      <TresDirectionalLight v-bind="lightOptions" />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { OrbitControls } from "@tresjs/cientos";
const modelPosition: Vector3Tuple[] = [[-2.922300338745117, 3.1845932006835938, -0.494598388671875]],
  scale = [0.5, 0.5, 0.5],
  cameraPosition: Vector3Tuple = [3.1601552032359335, 24.331109809561394, 7.889352327125035],
  lightOptions = {
    position: [0, 2, 0] as Vector3Tuple,
    rotation: [0.6283185307179586, 1.43116998663535, -0.9075712110370514] as Vector3Tuple,
    color: "#FFFFFF",
    intensity: 8,
    spotAngle: 0.8
  },
  unLoad = { notSkyBox: true };
</script>

<style lang="scss" scoped></style>
