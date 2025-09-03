<template>
  <div class="fullscreen pt5">
    <svg-icon :name="isFullscreen ?  'NoFullScreen' : 'FullScreen'" :icon-style="{ width: '18px', height: '18px', fill: '#4a88f5' }" @click.native="handleFullScreen" />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import screenfull from "screenfull";

const isFullscreen = ref(screenfull.isFullscreen);

onMounted(() => {
  screenfull.on("change", () => {
    if (screenfull.isFullscreen) isFullscreen.value = true;
    else isFullscreen.value = false;
  });
});

const handleFullScreen = () => {
  if (!screenfull.isEnabled) ElMessage.warning("当前您的浏览器不支持全屏 ❌");
  screenfull.toggle();
};
</script>
