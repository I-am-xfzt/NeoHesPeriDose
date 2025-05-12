<template>
  <div id="the-amap-container" class="wh100"></div>
</template>

<script setup lang="ts">
  import AMapLoader from '@amap/amap-jsapi-loader'
  import { NextLoading } from '@/utils/loading.ts'

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
  }
  const THEAMAPSTATE = reactive({
    theAmapLoader: undefined,
    AmapInstance: undefined,
  })
  const props = withDefaults(defineProps<thePropsType>(), {
    version: '2.0',
    plugins: () => [],
    center: () => [116.397428, 39.90923],
    zoom: 16,
    viewMode: '3D',
    pitch: 60,
    mapStyle: 'normal'
  })
  const initTheAmap = async () => {
    try {
      THEAMAPSTATE.theAmapLoader = await AMapLoader.load({
        key: 'ec69ad3af02ef9edb18d94f97034ee84',
        version: props.version,
        plugins: props.plugins,
        AMapUI: props.AMapUI,
      })
      console.log(THEAMAPSTATE)

      THEAMAPSTATE.AmapInstance = new THEAMAPSTATE.theAmapLoader.Map(
        'the-amap-container',
        {
          viewMode: props.viewMode, // 默认使用2D地图
          zoom: props.zoom, // 初始化地图级别
          center: props.center, // 初始化地图中心点
          pitch: props.pitch,
          mapStyle: `amap://styles/${props.mapStyle}`
        }
      )
    } catch (error) {
      console.error(error)
    } finally {
      NextLoading.done()
    }
  }
  onMounted(() => {
    console.log(props)
    initTheAmap()
  })
</script>

<style></style>
