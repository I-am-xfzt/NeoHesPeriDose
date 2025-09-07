<template>
  <div class="home_statistics flex-column">
    <div class="home_statistics_head">产品销售统计</div>
    <div class="home_statistics_body">
      <ECharts v-chartLoading="{ loading: false, time: 1000 }" :option="option" />
    </div>
  </div>
</template>

<script setup lang="ts" name="home_statistics">
import { ECOption } from "@/components/ECharts/config/index";
import { getStatisticsApi } from "@/api/home";
const ECharts = defineAsyncComponent(() => import("@/components/ECharts/index.vue"));
import echartsPxScale from "@/utils/echartsPxScale";

const data = {
  unit: ["销售额"],
  colors: ["#00A3FF"],
  emphasis: [
    {
      type: "linear" as const,
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: "#3793FF" },
        { offset: 1, color: "#F5F5F5" }
      ]
    }
  ],
  borderColor: ["#00A3FF", "#14C9C9"]
};

const option = reactive<ECOption>({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "none"
    },
    borderWidth: 0,
    padding: 6
    // backgroundColor: 'transparent'
  },
  legend: {
    show: false
  },
  grid: {
    top: "8%",
    left: "5%",
    right: "4%",
    bottom: "8%" //`${echartsPxScale(10)}%`
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#233653"
        }
      },
      axisLabel: {
        color: "#7ec7ff",
        padding: 0,
        fontSize: echartsPxScale(),
        margin: echartsPxScale(8)
      },
      axisTick: {
        show: false
      },
      data: []
    }
  ],
  yAxis: {
    // minInterval: 1,
    // splitNumber: 5,
    splitLine: {
      show: false
    },
    axisLabel: {
      show: true,
      color: "#B9D6D6",
      fontSize: echartsPxScale(),
      padding: 0
    },
    axisTick: {
      show: false
    }
  },
  series: data.unit.map((val, index: number) => {
    return {
      name: val,
      type: "line",
      symbol: "circle",
      showSymbol: false,
      smooth: true,
      lineStyle: {
        width: 3,
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
      data: []
    };
  })
});
const getData = () => {
  getStatisticsApi().then(res => {
    // @ts-ignore
    option.xAxis[0].data = res.data.map(item => item.date);
    // @ts-ignore
    option.series[0].data = res.data.map(item => item.production);
  });
};
onMounted(getData);
</script>
<style scoped lang="scss">
.home_statistics {
  height: 500px;
  margin: 25px 0;
  color: white;
  background: linear-gradient(180deg, #4dc3d7, #2b4ba1);
  border-radius: 12px;
  &_head {
    padding: 15px 44px 0;
    font-size: 23px;
  }
  &_body {
    flex: 1;
  }
}
</style>
