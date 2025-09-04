<template>
  <ParkPieChart
    :Image="inComeDistribution"
    chartCenterTitle="总收入"
    chartClass="marT8"
    :chartCenterValue="countValue"
  >
    <template #chart>
      <ECharts :option="option" />
    </template>
    <template #statistics>
      <PieChartRightStatistics className="ml10" unitName="%" v-model="data" />
    </template>
  </ParkPieChart>
</template>
    
<script setup lang='ts' name="inComeDistribution">
import inComeDistribution from '@/assets/BABYLONIMG/inComeDistribution.png'
import ParkPieChart from './commonPie/ParkPieChart.vue'
import ECharts from '@/components/ECharts/index.vue'
import { ECOption } from '@/components/ECharts/config'
import { getThousandsRef } from '@/custom-vue-ref/thousandsRef.ts'
import PieChartRightStatistics from './commonPie/PieChartRightStatistics.vue'
const baseValue = ref(5940)
const countValue = getThousandsRef(`${baseValue.value}`)
const data = reactive([
  {
    name: '停车收费',
    value: 65,
    p_style: {
      color: '#ffe79e'
    }
  },
  {
    name: '充电收费',
    value: 20,
    p_style: {
      color: '#ffe79e'
    }
  },
  {
    name: '车位收费',
    value: 15,
    p_style: {
      color: '#ffe79e'
    }
  }
])
const option = <ECOption>{
  tooltip: {
    trigger: 'item',
    formatter: '{b} :  {c}元'
  },
  color: ['#4fbfef', '#61a662', '#b0c7a2'],
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
      data: data.map((v) => ({
        name: v.name,
        value: (baseValue.value * v.value) / 100
      }))
    }
  ]
}
</script>
    
<style lang="scss" scoped>
</style>