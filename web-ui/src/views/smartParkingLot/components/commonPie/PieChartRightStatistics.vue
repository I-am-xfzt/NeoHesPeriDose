<template>
  <div class="statistics flex">
    <div class="FlexBox" v-for="(v,i) in datas" :key="i">
      <img v-if="v.img" :src="v.img" />
      <span :class="['span', props.className]">{{v.name}}</span>
      <div :class="['p', ...pName]" :style="v.p_style">
        {{v.value}}
        <span>{{props.unitName}}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts' name="PieChartRightStatistics">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  className: {
    type: String,
    default: 'ml3'
  },
  unitName: {
    type: String,
    default: '个'
  }
})
const emit = defineEmits(['update:modelValue'])
const datas = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
const pName = computed(() =>
  props.className == 'ml3'
    ? [`s-col-bottom`, `flex`, `ml15`]
    : ['s-row-right', 'FlexBox']
)
</script>
<style lang="scss" scoped>
.ml3 {
  margin-left: 3px;
}
.ml10 {
  margin-left: 10px;
}
.ml15 {
  margin-left: 15px;
}
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
    }
    .span {
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