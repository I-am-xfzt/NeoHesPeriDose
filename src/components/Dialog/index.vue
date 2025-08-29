<template>
  <el-dialog v-model="showDialog" v-bind="$attrs" :close-icon="false" :close-on-click-modal="false"
    :close-on-press-escape="false">
    <slot></slot>
    <template #footer>
      <el-button :round="isRound" @click="handleDialog('cancel')">{{cancelText}}</el-button>
      <el-button :round="isRound" type="primary" @click="handleDialog('confirm')">{{confirmText}}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang='ts' name="dialog">
  import {ElDialog} from "element-plus";
  const props = defineProps({
    visible: {type: Boolean},
    isRound: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: "确定"
    },
    cancelText: {
      type: String,
      default: "取消"
    }
  });
  const emitArr = ["update:visible","confirm", "cancel"] as const
  const emits = defineEmits(emitArr);
  const showDialog = computed({
    get: () => props.visible,
    set: (val) => emits("update:visible", val)
  });
  const close = () => {
    showDialog.value = false;
  };
  const handleDialog = (event: typeof emitArr[number])=>{
    emits(event);
    close();
  }
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>