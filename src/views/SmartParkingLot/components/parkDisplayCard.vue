<template>
  <div class="parkDisplayCard wh100 flex">
    <div class="parkDisplayCard-item FlexBox" v-for="(item, i) in currentCarInAndOutInfo" :key="item.title">
      <div class="title YouSheBiaoTiHei FlexBox">
        <img src="@/assets/BABYLONIMG/carIcon.png" />
        <span class="filterText">{{ item.title }}</span>
      </div>
      <div class="content FlexBox">
        <div class="content-title flex filterText">
          <span class="flex1" v-for="v in item.labels" :key="v">{{ v }}</span>
        </div>
        <div class="content-item">
          <vue3ScrollSeamless
            class="scroll-wrap"
            :key="i"
            :classOptions="classOptions"
            :dataList="dataList"
          >
          <div class="height32">
            <div class="FlexBox height32" v-for="c in dataList" :key="c.plate">
              <div class="flex1 height32" v-for="k in item.labels.length" :key="c.plate + k">{{ Object.values(c)[k - 1] }}</div>
            </div>
          </div>
          </vue3ScrollSeamless>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts' name="parkDisplayCard">
import { vue3ScrollSeamless } from 'vue3-scroll-seamless'
import { getCurrentCarInfo } from '../parkMock'
const labels = ['车牌号', '司机性别', '车辆类型']
const currentCarInAndOutInfo = ref([
  {
    img: '',
    title: '当前进场车辆',
    labels
    // dataList: getCurrentCarInfo()
  },
  {
    img: '',
    title: '当前离场车辆',
    labels: labels.concat(['停车时长'])
    // dataList: getCurrentCarInfo()
  }
])
const dataList = ref(getCurrentCarInfo())
const classOptions = {
  singleHeight: (32 * window.innerWidth) / 1920,
  step: 0,
  limitMoveNum: 6
}
</script>
<style lang="scss" scoped>
.parkDisplayCard {
  padding: 15px 80px;

  .height32 {
    height: 32px;
  }

  &-item {
    .flex1 {
      text-align: center;
    }

    padding-top: 14px;
    flex: 1;
    height: 100%;
    flex-direction: column;
    color: #84e4ea;

    .title {
      height: 40px;
      gap: 12px;
      font-size: 22px;

      span {
        color: transparent;
        background: linear-gradient(0deg,
            rgb(0, 255, 240) 0px,
            rgb(255, 255, 255) 100%) text;
        filter: drop-shadow(rgba(7, 44, 137, 0.5) 0px 1px 4px) drop-shadow(rgb(2, 42, 23) 0px 4px 4px);
      }

      img {
        margin-top: 3px;
        width: 26px;
        height: 21px;
      }
    }

    .content {
      width: 100%;
      height: calc(100% - 40px);
      flex-direction: column;

      &>div {
        width: 90%;
      }

      &-title {
        height: 36px;
        padding: 5px 0;
        letter-spacing: 1px;
        color: rgb(255, 255, 255);
        filter: drop-shadow(rgba(30, 121, 255, 0.8) 0px 0px 10px);
        font-size: 16px;
      }

      &-item {
        overflow: hidden;
        max-height: 64px;

        .scroll-wrap {
          @extend .height32;

          .flex1 {
            line-height: 32px;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>