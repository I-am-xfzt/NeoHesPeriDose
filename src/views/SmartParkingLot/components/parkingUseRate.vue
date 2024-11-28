<template>
  <div class="parkingUseRate s-row-center FlexBox">
    <div class="parkingUseRate-content FlexBox">
      <ECharts :option="option" />
      <!-- <div class="item" v-for="item in dataList">
        <el-progress :percentage="item.useRate" color="#5ecefb" :key="item.area">
          <template #default="{percentage}">
            <div class="percentage flx-justify-between">
              <p>{{item.area}}区</p>
              <div class="YouSheBiaoTiHei">
                <span>{{percentage}}</span>
                <span class="span">%</span>
              </div>
            </div>
          </template>
        </el-progress>
      </div>-->
    </div>
  </div>
</template>
    
<script setup lang='ts' name="parkingUseRate">
import { ElProgress } from 'element-plus'
import { getCommon } from '../parkMock'
import echartsPxScale from '@/utils/echartsPxScale.ts'
import progressBarImage from '@/assets/BABYLONIMG/progressbar.png'
const ECharts = defineAsyncComponent(
  () => import('@/components/ECharts/index.vue')
)
import { getStr } from '@/components/ECharts/config/customTooltip'
import { ECOption } from '@/components/ECharts/config'
const dataList = ref(getCommon())
const option = <ECOption>{
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
    formatter: (params: any) => `
    <div class="annual-tooltip tipBg">
      <span class="annual-month">${
        params[0].name
      }</span>
      <div class="annual-list">
        ${getStr(params[0], '车位使用率：')}
      </div>
    </div> `
  },
  xAxis: {
    type: 'value',
    show: false
  },
  yAxis: {
    type: 'category',
    data: getCommon().map((v) => `${v.area}区`),
    axisLabel: {
      color: '#5ecefb',
      verticalAlign: 'bottom',
      align: 'left',
      padding: [0, 0, echartsPxScale(5), echartsPxScale(15)],
      fontSize: echartsPxScale()
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  },
  color: ['#5ecefb'],
  series: [
    {
      type: 'bar',
      itemStyle: {
        // decal: { symbol: progressBarImage }
      },
      showBackground: true,
      backgroundStyle: {
        // color: '#0b1a20',
        // borderColor: '#101d22',
        // shadowColor: 'rgba(0, 0, 0, 0.5)',
        // shadowBlur: 2,
        // opacity: 0.7
      },
      tooltip: {
        show: true
      },
      label: {
        show: true,
        formatter: '{c}%',
        color: '#5ecefb',
        position: 'right',
        fontSize: echartsPxScale(),
        fontFamily: 'YouSheBiaoTiHei'
      },
      barWidth: echartsPxScale(5),
      data: getCommon().map((v) => v.useRate)
    }
  ],
  grid: {
    left: '3%',
    right: '3%',
    bottom: '3%',
    top: '15%',
    containLabel: true
  },
  // graphic: {
  //   elements: [
  //     {
  //       type: 'image',
  //       id: 'background',
  //       shape: {
  //         width: 80, // 根据需要调整宽度
  //         height: 300 // 根据需要调整高度
  //       },
  //       style: {
  //         image: progressBarImage, // 替换为你的图片地址
  //         width: 80, // 图片宽度
  //         height: 300 // 图片高度
  //       },
  //       position: [0, 0], // 图片位置
  //       scale: [1, 1], // 图片缩放
  //       bounding: 'all', // 裁剪区域
  //       z: -10 // 图层顺序
  //     }
  //   ]
  // }
}
</script>
    
<style lang="scss" scoped>
.parkingUseRate {
  margin-left: 16px;
  width: 330px;
  flex: 1;
  .percentage {
    width: 290px;
    color: #83b8d5;
    position: absolute;
    top: 0;
    left: 0;
    font-size: 16px;
    p {
      font-size: 14px;
    }
    .span {
      font-size: 12px;
    }
  }
  &-content {
    width: 100%;
    flex-direction: column;
    height: 100%;
    .item {
      display: flex;
      justify-content: center;
      flex: 1;
      .el-progress--line {
        width: 313px;
      }
      :deep(.el-progress-bar__outer) {
        height: 8px !important;
      }
      :deep(.el-progress__text) {
        min-width: 0.604167vmax;
      }
    }
  }
}
.tipBg {
  filter: hue-rotate(45deg) saturate(100%) brightness(150%) contrast(100%);
}
</style>