<template>
  <!-- <dv-border-box-1> -->
  <div class="wh100" id="modelContainer">
  </div>
  <!-- </dv-border-box-1> -->
</template>
<script setup lang="ts" name="ThreeModel">
  import type { GlbModelFilesType, LightsOptionsType } from './loadModel'
  import { ThreeModel, glbModelFiles } from './loadModel'
  import { Color } from 'three'
  interface thePropsType {
    sliceParams: string
    scale?: Vector3Tuple
    cameraPosition?: Vector3Tuple
    modelPosition: Vector3Tuple[]
    unLoad?: EmptyObjectType<boolean>
    color: string
    initGround?: boolean
    lightOptions?: LightsOptionsType
  }
  const props = withDefaults(defineProps<thePropsType>(), {
    scale: () => [0.1, 0.1, 0.1],
    cameraPosition: () => [
      8.315059204396917, 4.947735421646811, 24.30893949275867,
    ],
    lightOptions: () => ({
      position: [0, 2, 0],
      rotation: [-0.7425753144078179, -0.22235831397320124, 0.5584890371164615],
      color: new Color().setStyle('#abf7fd'),
      intensity: 4,
      spotAngle: 0.8,
    }),
		unLoad: ()=>({
			sky: true,
		})
  })
  const model = new ThreeModel(
    props.scale,
    props.cameraPosition,
    'modelContainer',
    props.lightOptions
  )
  const getLoadModelOptions: loadModelOptionsType<GlbModelFilesType> =
    glbModelFiles
      .filter((v) => props.sliceParams!.split(',').some((s) => v.includes(s)))
      .map((v, i) => [v, true, props.modelPosition![i]])
  onMounted(() => {

    model.init(getLoadModelOptions, props.unLoad, props.color)
    props.initGround && model.initGround()
  })
  defineExpose({
    model,
  })
</script>

<style>
  #modelContainer>canvas {
    width: 100%;
    height: 100%;
  }
</style>
