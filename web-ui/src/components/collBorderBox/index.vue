<template>
  <div :style="styles" class="collBorderBox flex">
    <div class="title flx-align-center">
      <span class="YouSheBiaoTiHei">{{props.title}}</span>
      <p>SAMPLE ENGLISH</p>
    </div>
    <slot />
  </div>
</template>
<script setup lang='ts' name="collBorderBox">
const props = defineProps({
  width: {
    type: String,
    default: ''
  },
  flex: {
    type: [String, Number],
    default: 1
  },
  height: {
    type: String
  },
  title: {
    type: String,
    default: '停车位统计'
  }
})
const styles = computed(() => {
  const styleOptions = {
    width: props.width,
    flex: props.flex,
    heigh: props.height
  }
  if (props.height) styleOptions['height'] = props.height
  return styleOptions
})
</script>
    
<style lang="scss" scoped>
.collBorderBox {
  width: 392px;
  flex-direction: column;
  .title {
    width: 100%;
    height: 33px;
    background: no-repeat url('@/assets/BABYLONIMG/title-chart.png');
    background-size: 100% 100%;
    padding-left: 38px;
    gap: 20px;
    span,
    p {
      writing-mode: horizontal-tb;
      word-spacing: 0px;
      letter-spacing: 0px;
      text-orientation: upright;
      user-select: text;
    }
    p {
      color: rgb(59, 139, 139);
      font-size: 10px;
      font-weight: bold;
    }
    span {
      font-size: 20px;
      color: rgb(42, 255, 255);
    }
  }
}
</style>