<template>
  <div class="container">
    <div id="the-amap-container" class="wh100"></div>
    <canvas id="babylonCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
  import AMapLoader from '@amap/amap-jsapi-loader'
  import { NextLoading } from '@/utils/loading.ts'
  import { BabyLonModel } from '../model/babylon/loadModel'
  import { Color4 } from '@babylonjs/core'
  window._AMapSecurityConfig = {
    securityJsCode: '74d795e58e9041b1be9c019bbdbc18b1',
  }

  interface baseType {
    version?: string
    plugins?: string[]
  }

  interface thePropsType extends baseType {
    AMapUI?: baseType
    center?: [number, number]
    zoom?: number
    viewMode?: '2D' | '3D'
    pitch?: number
    mapStyle?: string
    modelUrl?: string // 新增GLB模型路径参数
  }

  const props = withDefaults(defineProps<thePropsType>(), {
    version: '2.0',
    plugins: () => [],
    center: () => [116.397428, 39.90923],
    zoom: 16,
    viewMode: '3D',
    pitch: 60,
    mapStyle: 'normal',
    modelUrl: '管道布局12.13改细1_3.glb', // 默认模型路径
  })

  const THEAMAPSTATE = reactive({
    theAmapLoader: undefined,
    AmapInstance: undefined,
    babylonEngine: null,
    babylonScene: null,
    model: null,
  })

  // 初始化Babylon.js
  const initBabylon = async () => {
    const babylon = new BabyLonModel('babylonCanvas', '#000000')
    babylon.setLight({
      direction: [0, 1, 0],
      color: '#abf7fd',
      intensity: 1,
      spotAngle: 0.8,
    })
    babylon.scene.clearColor = new Color4(0, 0, 0, 0)
    babylon.initCamera({
      position: [-4.948233952230923, 12.944861680884872, 9.616543061181574],
      target: [0.45559694817256047, 0, 1.2397026017907171],
      other: {
        minPolarAngle: 60,
        maxPolarAngle: 270,
        rotateSpeed: 0.5,
        roam: false,
        roamSpeed: 1,
      },
    })
    const result = await babylon.init([
      ['管道布局12.13改细1_3.glb', true, [-0.12493869662284851, 0, 0]],
    ])
    console.log(result)
    THEAMAPSTATE.model = result[0].meshes[0]
  }

  // 同步模型位置到地图坐标
  const syncModelPosition = () => {
    if (!THEAMAPSTATE.AmapInstance || !THEAMAPSTATE.model) return
    console.log(THEAMAPSTATE)
    const center = THEAMAPSTATE.AmapInstance.getCenter()
    const pixel = THEAMAPSTATE.AmapInstance.lngLatToContainer(center)

    const canvas = document.getElementById('babylonCanvas') as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()

    // 计算模型在Babylon场景中的位置
    THEAMAPSTATE.model.position.x =
      ((pixel.getX() - rect.left) / rect.width) * 2 - 1
    THEAMAPSTATE.model.position.z = -(
      ((pixel.getY() - rect.top) / rect.height) * 2 -
      1
    )
  }

  const initTheAmap = async () => {
    try {
      THEAMAPSTATE.theAmapLoader = await AMapLoader.load({
        key: 'ec69ad3af02ef9edb18d94f97034ee84',
        version: props.version,
        plugins: props.plugins,
        AMapUI: props.AMapUI,
      })

      THEAMAPSTATE.AmapInstance = new THEAMAPSTATE.theAmapLoader.Map(
        'the-amap-container',
        {
          viewMode: props.viewMode,
          zoom: props.zoom,
          center: props.center,
          pitch: props.pitch,
          mapStyle: `amap://styles/${props.mapStyle}`,
        }
      )

      // 地图加载完成后初始化Babylon
      THEAMAPSTATE.AmapInstance.on('complete', async () => {
        await initBabylon()

        // 地图变化时同步模型位置
        THEAMAPSTATE.AmapInstance.on('camerachange', syncModelPosition)
        syncModelPosition()
      })
    } catch (error) {
      console.error(error)
    } finally {
      NextLoading.done()
    }
  }

  onMounted(() => {
    initTheAmap()
  })

  onUnmounted(() => {
    // 清理资源
    THEAMAPSTATE.babylonEngine?.dispose()
    if (THEAMAPSTATE.AmapInstance) {
      THEAMAPSTATE.AmapInstance.off('camerachange', syncModelPosition)
      THEAMAPSTATE.AmapInstance.destroy()
    }
  })
</script>

<style scoped>
  .container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  #the-amap-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  #babylonCanvas {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none; /* 允许鼠标事件穿透到地图 */
    background: transparent;
  }
</style>
