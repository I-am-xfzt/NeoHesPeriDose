<template>
  <div id="the-amap-container" class="wh100">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import { ElMessage } from 'element-plus'
const amapKeys: {
  key: string
  code: string
} = {
  key: import.meta.env.VITE_SYS_AMAP_KEY,
  code: import.meta.env.VITE_SYS_AMAP_CODE,
}
window._AMapSecurityConfig = {
  securityJsCode: amapKeys.code,
}
declare interface baseType {
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
  customFun: (arg: THEAMAPSTATETYPE) => Promise<void>
  features?: Array<typeof mapfeatures[number]>
}
const THEAMAPSTATE = reactive<THEAMAPSTATETYPE>({
  theAmapLoader: undefined,
  AmapInstance: undefined,
  mapSetCenter: () => {
  },
})
const props = withDefaults(defineProps<thePropsType>(), {
  version: '2.0',
  plugins: () => [],
  center: () => [116.397428, 39.90923],
  zoom: 11,
  viewMode: '3D',
  pitch: 60,
  mapStyle: 'normal',
  features: () => ['bg', 'road', 'building', 'point']
})
const initTheAmap = async () => {
  try {
    THEAMAPSTATE.theAmapLoader = await AMapLoader.load({
      key: amapKeys.key,
      version: props.version,
      plugins: props.plugins,
      AMapUI: props.AMapUI,

    })
    THEAMAPSTATE.AmapInstance = new THEAMAPSTATE.theAmapLoader!.Map(
        'the-amap-container',
        {
          resizeEnable: true,
          viewMode: props.viewMode, // 默认使用2D地图
          zoom: props.zoom, // 初始化地图级别
          center: props.center, // 初始化地图中心点
          pitch: props.pitch,
          features: props.features,
          mapStyle: `amap://styles/${props.mapStyle}`,
        }
    )
    THEAMAPSTATE.mapSetCenter = (lnglat, immediately, duration ) => {
      THEAMAPSTATE.AmapInstance!.setCenter(lnglat, true, immediately, duration)
    }
    await props.customFun(THEAMAPSTATE)
  } catch (error) {
    console.error(error)
    ElMessage.error(error)
  } finally {
  }
}
onMounted(() => {
  initTheAmap()
})
onUnmounted(() => {
  if (THEAMAPSTATE.AmapInstance) {
    THEAMAPSTATE.AmapInstance.clearEvents()
    THEAMAPSTATE.AmapInstance.clearMap()
    THEAMAPSTATE.AmapInstance.destroy()
    THEAMAPSTATE.AmapInstance = null
    THEAMAPSTATE.theAmapLoader = null
    THEAMAPSTATE.mapSetCenter = () => {
    }
  }
})
</script>

<style>
.amap-logo, .amap-copyright{
  display: none !important;
}
</style>
