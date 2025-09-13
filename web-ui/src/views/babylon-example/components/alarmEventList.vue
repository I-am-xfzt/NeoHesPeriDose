<template>
  <div class="alarmEvent s-row-center flex">
    <div class="alarmEvent-title FlexBox">
      <span>告警时间</span>
      <span>告警位置</span>
      <span>告警信息</span>
    </div>
    <div class="alarmEvent-content posR">
      <div class="alarmEvent-content-item wh100">
        <div :class="['item', {tableRow: v % 2 === 0}]" v-for="v in 6"></div>
      </div>
        <div class="flex">
          <div class="item FlexBox" v-for="(item, v) in dataList">
            <span class="time">{{item.alarmTime}}</span>
            <span>{{item.area}}区</span>
            <span>{{item.alarmType}}</span>
          </div>
        </div>
    </div>
  </div>
</template>
    
<script setup lang='ts' name="alarmEventList">
import { getRandomDate } from '@/utils/getAssignTime'
import { getCommon } from "../parkMock"
const dataList = ref(getCommon().map((v) => ({ alarmTime: getRandomDate(2024), ...v })))
window.innerHeight
const classOptions = {
  singleHeight: 38 * window.innerWidth / 1920,
  step: 1
}
</script>
    
<style lang="scss" scoped>
.alarmEvent {
  width: 355px;
  flex-direction: column;
  flex: 1;
  
  &-title {
    background: no-repeat url('@/assets/BABYLONIMG/tableTitle.png');
    background-size: 100% 100%;
    width: 100%;
    height: 45px;
    span {
      flex: 1;
      letter-spacing: 1px;
      color: rgb(42, 255, 255);
      text-align: center;
      font-size: 16px;
    }
  }
  &-content {
    width: 100%;
    height: 228px;
    overflow: hidden;
    .flex {
      flex-direction: column;
      height: 228px;
    }
    &-item {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
    }
    .item {
      width: 100%;
      flex: 1;
      color: #84878b;
      font-size: 12px;
      span {
        text-align: center;
        flex: 1;
      }
    }
  }
  .tableRow {
    background: no-repeat url('@/assets/BABYLONIMG/tableRow.png');
    background-size: 100% 100%;
  }
}
</style>