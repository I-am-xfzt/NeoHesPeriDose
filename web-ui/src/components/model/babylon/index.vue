<template>
  <canvas id="babylonContainer"></canvas>
  <div class="absolute fps">{{ fps }}</div>
</template>

<script setup lang="ts">
import { BabyLonModel, glbModelFiles, LightsOptions } from "./loadModel";
import type { GlbModelFilesType } from "./loadModel";
const fps = ref("0fps");
interface thePropsType {
  sliceParams: string; // 模型文件的名字
  scale?: Vector3Tuple; // 缩放值
  camera?: {
    target: Vector3Tuple;
    position: Vector3Tuple;
    other: {
      minPolarAngle: number;
      maxPolarAngle: number;
      rotateSpeed: number;
      roam: boolean;
      roamSpeed: number;
    };
  }; // 相机位置参数
  modelPosition: Vector3Tuple[]; // 模型的位置参数
  unLoad?: EmptyObjectType<boolean>; //
  color?: string; // 场景的颜色
  lightOptions?: LightsOptions;
}
const modelValue = ref<BabyLonModel>();
const props = withDefaults(defineProps<thePropsType>(), {
  scale: () => [0.1, 0.1, 0.1],
  camera: () => ({
    target: [0, 0, 0],
    position: [0, 0, 0],
    other: {
      minPolarAngle: 60,
      maxPolarAngle: 270,
      rotateSpeed: 0.5,
      roam: false,
      roamSpeed: 1
    }
  }),
  modelPosition: () => [[-8.260836601257324, 1.139329195022583, -22.13763427734375]],
  color: "#0a1620",
  lightOptions: () => ({
    direction: [0, 1, 0],
    color: "#abf7fd",
    intensity: 1,
    spotAngle: 0.8
  }),
  unLoad: () => ({
    sky: false,
    ground: true,
    aperture: false
  })
});
const modelNames = glbModelFiles.filter(v => props.sliceParams!.split(",").some(s => v.includes(s)));
const getLoadModelOptions: loadModelOptionsType<GlbModelFilesType> = modelNames.map((v, i) => [
  v,
  true,
  props.modelPosition.length == 1 ? props.modelPosition[0] : props.modelPosition![i]
]);
onMounted(() =>
  nextTick(() => {
    modelValue.value = new BabyLonModel("babylonContainer", props.color);
    modelValue.value.setLight(props.lightOptions);
    modelValue.value.initCamera(props.camera);
    // props.unLoad.ground && modelValue.value.initGround()
    props.unLoad.aperture && modelValue.value.createAuraPostProcess();
    modelValue.value.render(() => {
      setTimeout(() => {
        fps.value = modelValue.value!.engine.getFps().toFixed(0) + "fps";
      }, 1000);
    });
    modelValue.value.init(getLoadModelOptions);
  })
);
</script>

<style>
#babylonContainer {
  width: 100%;
  height: 100%;
}
.fps {
  color: #fff;
  left: 0;
  top: 100px;
}
</style>
