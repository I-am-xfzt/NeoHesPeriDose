<template>
        <Model ref="ModelRef" sliceParams="展开" :unLoad="unLoad" color="#02121f" :lightOptions="lightOptions"
                :scale="scale" :cameraPosition="cameraPosition" :modelPosition="modelPosition" :initGround="true" />
</template>

<script setup lang='ts'>
const Model = defineAsyncComponent(() => import("@/components/model/three/index.vue"));
import { Color } from "three";
const ModelRef = ref<typeof Model>(),
        modelPosition: Vector3Tuple[] = [[ -2.922300338745117, 3.1845932006835938, -0.494598388671875]],
        scale = [0.5, 0.5, 0.5],
        cameraPosition = [3.1601552032359335, 24.331109809561394, 7.889352327125035],
        lightOptions = {
                position: [0, 2, 0],
                rotation: [0.6283185307179586, 1.43116998663535, -0.9075712110370514],
                color: new Color().setStyle("#FFFFFF"),
                unSetOther: true,
                intensity: 8,
                spotAngle: 0.8
        },
        unLoad = { notSkyBox: true }
</script>

<style lang="scss" scoped></style>