<template>
  <div class="carQuantityInandOut">
    <ECharts :option="option" />
  </div>
</template>
    
<script setup lang='ts' name="carQuantityInandOut">
import { ECOption } from '@/components/ECharts/config'
import { getStr } from '@/components/ECharts/config/customTooltip'
import ECharts from '@/components/ECharts/index.vue'
import echartsPxScale from '@/utils/echartsPxScale.ts'
interface ChartProp {
  label: string
  value: string[]
}

const annualData = [
  {
    label: '离开',
    value: [
      '20',
      '25',
      '56',
      '68',
      '209',
      '178',
      '403',
      '215',
      '357',
      '298',
      '390',
      '100'
    ]
  },
  {
    label: '进入',
    value: [
      '59',
      '46',
      '100',
      '130',
      '230',
      '310',
      '269',
      '349',
      '475',
      '589',
      '498',
      '297'
    ]
  }
]

const data = {
  data: annualData,
  unit: annualData.map((val) => val.label),
  columns: Array.from({ length: 12 }, (_, i) => (i + 1) * 2),
  colors: ['#4f6a5f', '#26464d'],
  emphasis: ['#779062', '#439d9e'],
  borderColor: ['#728567', '#417983']
}

const option: ECOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    },
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
    formatter: (params: any) => {
      let str = ''
      params.forEach(
        (val: { color: string; seriesName: string; data: number }) => {
          str += getStr(val)
        }
      )
      const dom = `
                    <div class="annual-tooltip">
                      <span class="annual-month">${
                        (params[0].dataIndex + 1) * 2
                      }点</span>
                      <div class="annual-list">
                        ${str}
                      </div>
                    </div>
                  `
      return dom
    }
  },
  legend: {
    right: 'center',
    top: '0%',
    itemWidth: echartsPxScale(10),
    itemHeight: 1,
    align: 'auto',
    icon: 'rect',
    itemGap: echartsPxScale(),
    textStyle: {
      color: '#ebebf0',
      fontSize: echartsPxScale(10)
    }
  },
  grid: {
    top: '10%',
    left: '15%',
    right: '4%',
    bottom: '12%' //`${echartsPxScale(10)}%`
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#233653'
        }
      },
      axisLabel: {
        color: '#7ec7ff',
        padding: 0,
        fontSize: echartsPxScale(),
        margin: echartsPxScale(8),
        formatter: function (data) {
          return data
        }
      },
      axisTick: {
        show: false
      },
      data: data.columns
    }
  ],
  yAxis: {
    // minInterval: 1,
    // splitNumber: 5,
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed', // 设置为虚线,
        color: '#142227'
      }
    },
    axisLabel: {
      show: true,
      color: '#B9D6D6',
      fontSize: echartsPxScale(),
      padding: 0
    },
    axisTick: {
      show: false
    }
  },
  series: data.data.map((val: ChartProp, index: number) => {
    return {
      name: val.label,
      type: 'line',
      symbol: 'circle',
      showSymbol: false,
      smooth: true,
      lineStyle: {
        width: 1,
        color: data.colors[index],
        borderColor: data.colors[index]
      },
      itemStyle: {
        color: data.colors[index],
        borderColor: data.borderColor[index],
        borderWidth: 2
      },
      tooltip: {
        show: true
      },
      areaStyle: {
        color: data.emphasis[index],
        opacity: 0.2
      },
      emphasis: {
        itemStyle: {
          color: data.emphasis[index]
        }
      },
      data: val.value
    }
  })
}
</script>
    
<style lang="scss">
@use '@/styles/chartToolTips.scss';
.carQuantityInandOut {
  width: 338px;
  flex: 1;
}
</style>