<template>
  <div class="ParkPieChart flx-center posR">
    <div :style="styles" class="img flex">
      <div :class="['chart', props.chartClass]">
        <slot name="chart" />
        <div class="chart-center flx-justify-between YouSheBiaoTiHei">
          <p>{{props.chartCenterTitle}}</p>
          <span>{{props.chartCenterValue}}</span>
        </div>
      </div>
      <slot name="statistics" />
    </div>
  </div>
</template>
    
<script setup lang='ts' name="ParkPieChart">
const props = defineProps({
  Image: {
    type: String
  },
  chartCenterTitle: {
    type: String
  },
  chartCenterValue: {
    type: String
  },
  chartClass: {
    type: String,
    default: 'marT4'
  }
})
const styles = computed(() => ({
  background: `no-repeat url(${props.Image})`,
  backgroundSize: `100% 100%`
}))
</script>
    
<style lang="scss" scoped>
.marT4 {
  margin-top: 4px;
}
.marT8 {
  margin-top: 8px;
}
.ParkPieChart {
  flex: 1;
  width: 100%;
  //   transform: scale(0.8);
  .img {
    width: 89.03%;
    height: 145px;
    overflow: hidden;
  }
  .chart {
    width: 137px;
    height: 137px;
    position: absolute;
    z-index: 99;
    &-center {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 30px;
      text-align: center;
      flex-direction: column;
      width: 80px;
      height: 45px;
      p {
        color: #fff;
        font-size: 16px;
      }
      span {
        color: #78dae4;
        font-size: 20px;
      }
    }
  }
}
</style>