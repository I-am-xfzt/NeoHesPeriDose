<template>
  <div class="inComeTrend">
    <ECharts :option="option" />
  </div>
</template>
    
<script setup lang='ts' name="inComeTrend">
import { color, graphic } from 'echarts'
import echartsPxScale from '@/utils/echartsPxScale.ts'
const ECharts = defineAsyncComponent(
  () => import('@/components/ECharts/index.vue')
)
import { getStr } from '@/components/ECharts/config/customTooltip'
import { ECOption } from '@/components/ECharts/config'
// prettier-ignore
let data = [80000, 90000, 110000, 85000, 100000, 110000, 120000, 180000, 120000, 150000, 120000, 150000];
const option = <ECOption>{
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    },
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
    formatter: (params: any) => `
                <div class="annual-tooltip tipBg">
                  <span class="annual-month">${
                    params[0].dataIndex + 1
                  }月份（金额：元）</span>
                  <div class="annual-list">
                    ${getStr(params[0], '收入')}
                  </div>
                </div>
                  `
  },
  xAxis: {
    data: Array.from({ length: 12 }, (_, i) => i + 1),
    axisLabel: {
      color: '#fff',
      fontSize: echartsPxScale(),
      margin: echartsPxScale(8),
      align: 'center'
    },
    axisTick: {
      show: false
    }
  },
  yAxis: {
    max: 200000,
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#fff',
      fontSize: echartsPxScale(),
      formatter: (v) => `${v / 10000}w`
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed', // 设置为虚线,
        color: '#142227'
      }
    }
  },
  series: [
    {
      type: 'bar',
      showBackground: false,
      itemStyle: {
        color: graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ]),
        borderRadius: 15
      },
      tooltip: {
        show: true
      },
      barWidth: echartsPxScale(5),
      data: data
    }
  ],
  grid: {
    left: '1%',
    right: '5%',
    bottom: '1%',
    top: '8%',
    containLabel: true
  }
}
// {
//   xAxis: {
//     data: Array.from({ length: 12 }, (_, i) => i + 1),
//     axisLine: {
//       show: false
//     },
//     axisTick: {
//       show: false
//     },
//     axisLabel: {
//       color: '#fff'
//     }
//   },
//   yAxis: {
//     axisLine: {
//       show: false
//     },
//     splitLine: {
//       show: true,
//       lineStyle: {
//         type: 'dashed' // 设置为虚线
//       }
//     },
//     axisTick: {
//       show: true
//     },
//     axislabel: {
//       show: true,
//       formatter: (value) => `${value / 10000}w` // 显示数值并添加单位 'w'
//     }
//   },
//   series: [
//     {
//       type: 'bar',
//       showBackground: true,
//       itemStyle: {
//         color: new graphic.LinearGradient(0, 0, 0, 1, [
//           { offset: 0, color: '#83bff6' },
//           { offset: 0.5, color: '#188df0' },
//           { offset: 1, color: '#188df0' }
//         ]),
//         borderRadius: 10
//       },
//       data
//     }
//   ],
//   grid: {
//     left: '3%',
//     right: '4%',
//     bottom: '3%',
//     top: '5%',
//     containLabel: true
//   }
// }
// option
//  =
</script>
    
<style>
.inComeTrend {
  width: 100%;
  flex: 1;
  font-size: 12px;
}
.tipBg {
  /* background-color: #83bff6;
  background-blend-mode: multiply; */
  filter: hue-rotate(45deg) saturate(100%) brightness(100%) contrast(100%);
}
</style>