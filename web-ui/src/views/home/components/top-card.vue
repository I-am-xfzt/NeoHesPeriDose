<template>
  <div class="home-top-card flex gap-24">
    <div class="home-top-card-item FlexBox hand s-row-between" v-for="(item, i) in dataList" :key="i">
      <div class="home-top-card-item-left t-center">
        <div class="home-top-card-item-title">{{ item.title }}</div>
        <div class="home-top-card-item-value" :id="item.id+i">{{ verifyNumberComma(item.value) }}</div>
      </div>
      <div class="home-top-card-item-right">
        <canvas style="width: 150px; height: 60px" :id="item.id"></canvas>
        <div class="text FlexBox gap-10">
          <svg-icon
            :name="i == 2 ? 'Decline' : 'Rize'"
            :icon-style="{
              width: `36px`,
              height: `25px`,
              fill: '#fff'
            }"
          ></svg-icon>
          <span>{{ item.process }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CurveDrawer } from "@/utils/curveDrawer";
import { verifyNumberComma } from "@/utils/toolsValidate";
import { CountUp } from "countup.js";
const dataList = ref([
  {
    title: "用户数",
    value: "132893",
    process: "13.11%",
    values: [30, 50, 20, 60, 40, 50, 20, 60],
    id: "canvas_user"
  },
  {
    title: "订单数",
    value: "219456",
    process: "36.6%",
    id: "canvas_order",
    values: [30, 50, 20, 60, 40, 60, 30, 60]
  },
  {
    title: "商品数",
    value: "854972",
    process: "23.3%",
    id: "canvas_goods",
    values: [30, 50, 20, 60, 40, 70, 30, 30]
  },
  {
    title: "销售额",
    value: "654932",
    process: "24.36%",
    id: "canvas_sales",
    values: [30, 50, 20, 60, 40, 40, 20, 60]
  }
]);
// 初始化数字滚动
const initNumCountUp = () => {
  nextTick(() => {
    dataList.value.forEach((v, index) => {
      new CountUp(document.getElementById(`${v.id}${index}`) as HTMLDivElement, Number(v.value)).start();
    });
  });
};
onMounted(() => {
  initNumCountUp();
  dataList.value.forEach(item => {
    CurveDrawer.drawMountainCurve(document.getElementById(item.id) as HTMLCanvasElement, item.values, {
      lineColor: "#fff",
      lineWidth: 8
    });
  });
});
</script>

<style lang="scss" scoped>
.home-top-card {
  &-item:nth-child(1) {
    background: linear-gradient(90deg, #31c5de, #4776f7);
  }
  &-item:nth-child(2) {
    background: linear-gradient(90deg, #fa9797, #ff75b2);
  }
  &-item:nth-child(3) {
    background: linear-gradient(90deg, #3dd3b2, #10a0e6);
  }
  &-item:nth-child(4) {
    background: linear-gradient(90deg, #ea83f7, #7773f3);
  }

  color: #fff;
  &-item {
    flex: 1;
    border-radius: 20px;
    transition: all 0.3s ease;
    padding: 20px 28px;
    height: 160px;
    &-title {
      font-size: 18px;
      margin-bottom: 20px;
    }
    &-value {
      font-size: 32px;
    }
    &-right {
      .text {
        font-size: 16px;
      }
    }
    &:hover {
      box-shadow: 0 5px 20px 0 rgb(50 50 50 / 54%);
      transform: translateY(-4px) scale(1.01);
    }
  }
}
</style>
