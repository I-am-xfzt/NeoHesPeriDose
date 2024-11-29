<template>
  <ParkPieChart :Image="parkStatics" chartCenterTitle="总数" :chartCenterValue="countValue">
    <template #chart>
      <ECharts :option="option" />
    </template>
    <template #statistics>
      <PieChartRightStatistics v-model="data" />
    </template>
  </ParkPieChart>
</template>
    
<script setup lang='ts' name="parkingSpaceStatistics">
import parkStatics from '@/assets/BABYLONIMG/parkStatics.png'
import ParkPieChart from './commonPie/ParkPieChart.vue'
import ECharts from '@/components/ECharts/index.vue'
import type { ECOption } from '@/components/ECharts/config.ts'
import { getThousandsRef } from '@/utils/customVueRef.ts'
import occupy from '@/assets/BABYLONIMG/occupy.png'
import leisure from '@/assets/BABYLONIMG/leisure.png'
import PieChartRightStatistics from "./commonPie/PieChartRightStatistics.vue"
const data = reactive([
  {
    name: '占用',
    value: '830',
    img: occupy,
    p_style: {
      color: '#2affff'
    }
  },
  {
    name: '空闲',
    value: '170',
    img: leisure,
    p_style: {
      color: '#ffd249'
    }
  }
])
const countValue = getThousandsRef('1000')
const option :ECOption = {
  tooltip: {
    trigger: 'item',
    formatter: '{b} :  {c}个'
  },
  color: ['#4fbfef', '#b0c7a2'],
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['65%', '80%'],
      avoidLabelOverlap: false,
      padAngle: 2,
      itemStyle: {
        borderRadius: 0
      },
      label: {
        show: false,
        position: 'center'
      },
      labelLine: {
        show: false
      },
      data
    }
  ]
}
</script>
    
<style lang="scss" scoped>
.statistics {
  margin-left: 170px;
  flex-direction: column;
  div {
    flex: 1;
    img {
      width: 24px;
      height: 24px;
      margin-top: 6px;
    }
    .p {
      width: 75px;
      font-family: YouSheBiaoTiHei;
      font-size: 24px;
      text-align: center;
      margin-left: 15px;
    }
    .span {
      margin-left: 3px;
      text-align: center;
      font-size: 16px;
      color: #fff;
    }
    span {
      font-size: 12px;
      color: #288fa6;
    }
  }
}
</style>