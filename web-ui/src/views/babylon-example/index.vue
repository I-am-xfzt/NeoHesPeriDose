<template>
  <div class="wh100 container FlexBox s-row-between">
    <div class="top-border borders flx-between">
      <div class="top-border-left"></div>
      <span class="systemTitle YouSheBiaoTiHei">{{ systemTitle }}</span>
      <div class="top-border-right"></div>
    </div>
    <div class="rotateConTent flx-between">
      <div
        @click="
          switchToCom({
            bgImg: centerParkBg,
            name: 'park-display-card'
          })
        "
        class="rotateConTent-left flx-align-center"
      >
        <div class="posR">
          <img :src="rotateImg" />
          <div class="icon"></div>
        </div>
        <div class="content flx-center">
          <p>停车场</p>
        </div>
      </div>
      <div
        @click="switchToCom({ bgImg: centerChargeBg, name: 'charge-display-card' })"
        class="rotateConTent-right flx-align-center"
      >
        <div class="posR">
          <img :src="rotateImg" />
          <div class="icon"></div>
        </div>
        <div class="content flx-center">
          <p>充电桩</p>
        </div>
      </div>
    </div>
    <div class="left-border borders"></div>
    <div class="right-border borders"></div>
    <div class="bottom-border borders"></div>
    <div class="container-model posCenter">
      <Model sliceParams="sm_car.gltf" :renderFrequency="6" :camera="modelCaramOp" :modelPosition="[[0, 0, 0]]" />
    </div>
    <div v-for="(item, i) in Object.keys(componentsDistribution)" :key="i" :class="[`container-${item}`, 's-row-between']">
      <CollBorderBox v-for="com in componentsDistribution[item as keys]" v-bind="com" :key="com.is">
        <component :is="com.is" />
      </CollBorderBox>
    </div>
    <div :style="{ backgroundImage: `url(${centerComponentInfo.bgImg})` }" class="container-center">
      <component :is="centerComponentInfo.name"></component>
    </div>
    <!-- <div optionsClass="container-right s-row-between">
      <CollBorderBox v-for="com in componentsDistribution.right" v-bind="com" :key="com.is">
        <component :is="com.is" />
      </CollBorderBox>
    </div> -->
  </div>
</template>

<script setup lang="ts" name="babylon-data-screen">
import rotateImg from "@/assets/BABYLONIMG/rotate.png";
import Model from "@/components/model/babylon/index.vue";
import CollBorderBox from "@/components/collBorderBox/index.vue";
import centerParkBg from "@/assets/BABYLONIMG/centerParkBg.png";
import centerChargeBg from "@/assets/BABYLONIMG/centerChargeBg.png";
const systemTitle = "停车场智慧大屏";
const modelCaramOp = {
  target: [0, 0, 0] as Vector3Tuple,
  position: [-5, 4, 5] as Vector3Tuple,
  other: {
    minPolarAngle: 60,
    maxPolarAngle: 180,
    rotateSpeed: 0.5,
    roam: false,
    roamSpeed: 1
  }
};
interface centerComponentInfoType {
  bgImg: string;
  name: "park-display-card" | "charge-display-card";
}
let centerComponentInfo = shallowReactive<centerComponentInfoType>({
  bgImg: centerParkBg,
  name: "park-display-card"
});
interface comPropType {
  title: string;
  is: string;
  flex?: string;
  height?: string;
}
type keys = "left" | "right";
type componentsDistributionType = Record<keys, comPropType[]>;
const componentsDistribution = reactive<componentsDistributionType>({
  left: [
    {
      title: "停车位统计",
      is: "parking-space-statistics",
      flex: "0 1 28%",
      height: "28%"
    },
    {
      title: "今日进出车辆次数",
      is: "car-quantity-inand-out"
    },
    {
      title: "停车场各区车位使用率",
      flex: `0 1 ${39 * (window.chartScale ?? 1)}%`,
      height: `${39 * (window.chartScale ?? 1)}%`,
      is: "parking-use-rate"
    }
  ],
  right: [
    {
      title: "停车场收入分布",
      is: "in-come-distribution",
      flex: "0 1 28%",
      height: "28%"
    },
    {
      title: "停车场月收入趋势",
      is: "in-come-trend"
    },
    {
      title: "告警事件列表",
      flex: `0 1 ${39 * (window.chartScale ?? 1)}%`,
      height: `${39 * (window.chartScale ?? 1)}%`,
      is: "alarm-event-list"
    }
  ]
});
const switchToCom = (value: centerComponentInfoType) => {
  if (centerComponentInfo.name === value.name) return;
  centerComponentInfo = value;
};
</script>

<style lang="scss">
@use "./index.scss";
</style>
