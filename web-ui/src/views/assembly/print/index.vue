<template>
  <div ref="printRef" class="page-container">
    <el-card shadow="hover" header="打印演示">
      <el-alert
        title="感谢优秀的 `print-js`，项目地址：https://github.com/crabbly/Print.js。请在打印弹窗 `更多设置` 中开启 `背景图形。`"
        type="primary"
        :closable="false"
        class="mb15"
      ></el-alert>
      <div class="t-center">
        <el-button @click="onPrintJs" type="primary"> 点击打印演示 </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="PrintJs">
import printJs from "print-js";

// 定义变量内容
const printRef = ref();

// 打印点击
const onPrintJs = () => {
  printJs({
    printable: printRef.value,
    type: "html",
    css: ["//at.alicdn.com/t/c/font_2298093_rnp72ifj3ba.css", "/src/styles/element_07ffe5bf.css"],
    scanStyles: false,
    style: `@media print{.mb15{margin-bottom:15px;}.el-button--small i.iconfont{font-size: 12px !important;margin-right: 5px;}}`
  });
};
</script>
