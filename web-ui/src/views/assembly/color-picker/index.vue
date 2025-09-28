<template>
  <div ref="printRef" class="page-container">
    <el-card shadow="hover" header="颜色吸管工具">
      <el-alert title="Web 吸色器 (EyeDropper API)" type="primary" :closable="false" class="mb15"></el-alert>

      <div v-if="selectedColor" class="l-t-center gap-15 rounded-8">
        <div class="color-preview" :style="{ backgroundColor: selectedColor }"></div>
        <el-input v-model="selectedColor" readonly class="color-input">
          <template #append>
              <el-icon @click="copyColor" color="#fff"><CopyDocument /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="color-picker-container">
        <el-button type="primary" @click="openEyeDropper" :disabled="!isSupported" class="picker-button">
          {{ isSupported ? "点击吸色" : "浏览器不支持" }}
        </el-button>

        <div v-if="!isSupported" class="support-warning">
          <el-alert
            title="当前浏览器不支持 EyeDropper API，请使用 Chrome 95+ 或 Edge 95+ 浏览器"
            type="warning"
            :closable="false"
            show-icon
          ></el-alert>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="color-picker">
import { CopyDocument } from "@element-plus/icons-vue";
import { useMessage } from "@/hooks/message";

// 检查浏览器是否支持 EyeDropper API
const isSupported = ref(false);
const selectedColor = ref<string>("");
const message = useMessage();

// 检查 EyeDropper API 支持情况
onMounted(() => {
  isSupported.value = !!(window as any).EyeDropper;
});

// 打开吸色器
const openEyeDropper = async () => {
  if (!isSupported.value) {
    message.warning("当前浏览器不支持 EyeDropper API");
    return;
  }

  try {
    const eyeDropper = new (window as any).EyeDropper();
    const result = await eyeDropper.open();
    selectedColor.value = result.sRGBHex;
    message.success(`选中颜色: ${result.sRGBHex}`);
  } catch (error: any) {
    if (error.name === "AbortError") {
      // 用户取消操作，这是正常情况，不需要提示错误
      console.log("用户取消了吸色操作");
    } else {
      message.error("吸色失败: " + error.message);
    }
  }
};

// 复制颜色值到剪贴板
const copyColor = async () => {
  try {
    await navigator.clipboard.writeText(selectedColor.value);
    message.success("颜色值已复制到剪贴板");
  } catch (error) {
    message.error("复制失败");
  }
};
</script>

<style scoped>
.color-picker-container {
  text-align: center;
}

.picker-button {
  margin-bottom: 20px;
}

.color-preview {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #ddd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.color-input {
  width: 200px;
}

.support-warning {
  margin-top: 20px;
}
</style>
