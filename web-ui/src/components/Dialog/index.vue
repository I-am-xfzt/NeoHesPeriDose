<template>
  <el-dialog
    v-model="showDialog"
    v-bind="$attrs"
    :show-close="showClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
  >
    <slot></slot>
    <template #footer>
      <template v-if="showBtns">
        <el-button :round="isRound" @click="handleDialog('cancel')">{{ cancelText }}</el-button>
        <el-button :round="isRound" type="primary" @click="handleDialog('confirm')">{{ confirmText }}</el-button>
      </template>
      <slot name="other_btn"></slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="the-dialog">
import { ElDialog } from "element-plus";
const props = defineProps({
  visible: { type: Boolean },
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
  },
  showClose: {
    type: Boolean,
    default: false
  },
  showBtns: {
    type: Boolean,
    default: true
  },
  clickConfirmNoclose: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["update:visible", "confirm", "cancel"]);
const showDialog = computed({
  get: () => props.visible,
  set: val => emits("update:visible", val)
});
const close = () => {
  showDialog.value = false;
};
const handleDialog = (event: "update:visible" | "confirm" | "cancel") => {
  emits(event);
  (event === "confirm" ? !props.clickConfirmNoclose : true) && close();
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
