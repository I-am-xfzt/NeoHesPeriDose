<script setup lang="ts" name="compress-image">
import { useMessage } from "@/hooks/message";
import { Download, Refresh } from "@element-plus/icons-vue";
// 状态管理
const state = reactive({
  originalFile: null,
  originalImage: "",
  compressedImage: "",
  quality: 80,
  format: "jpeg",
  width: 100,
  isCompressing: false,
  originalSize: 0,
  compressedSize: 0,
  activeFormat: "jpeg"
});

// 计算属性
const compressionRatio = computed(() => {
  if (!state.originalSize || !state.compressedSize) return 0;
  return Math.round((state.compressedSize / state.originalSize) * 100);
});

const sizeReduction = computed(() => {
  if (!state.originalSize || !state.compressedSize) return 0;
  return Math.round(((state.originalSize - state.compressedSize) / state.originalSize) * 100);
});

// 模拟文件上传处理
const handleFileUpload = () => {
  state.isCompressing = true;

  // 模拟上传和压缩过程
  setTimeout(() => {
    state.originalImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
    state.compressedImage = state.originalImage;
    state.originalSize = 3840;
    state.compressedSize = Math.floor(state.originalSize * (state.quality / 100));
    state.isCompressing = false;
    useMessage().success("图片上传并压缩成功！");
  }, 1000);
};

// 模拟压缩处理
const compressImage = () => {
  if (!state.originalImage) return;

  state.isCompressing = true;

  // 模拟压缩过程
  setTimeout(() => {
    state.compressedSize = Math.floor(state.originalSize * (state.quality / 100));
    state.isCompressing = false;

    useMessage().success("图片重新压缩成功！");
  }, 1000);
};

// 模拟下载功能
const downloadCompressedImage = () => {
  useMessage().success("压缩图片下载成功！");
};

// 格式化文件大小
const formatFileSize = bytes => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 监听质量变化
const handleQualityChange = () => {
  if (state.originalImage) {
    compressImage();
  }
};

// 选择格式
const selectFormat = format => {
  state.activeFormat = format;
  useMessage().info(`已选择 ${format.toUpperCase()} 格式`);
};
</script>
<template>
  <div class="page-container">
    <el-card class="compress-card">
      <template #header>
        <div>
          <!-- <svg-icon
            name="Upload"
            :icon-style="{
              fill: '#6a11cb',
              width: '30px',
              height: '30px'
            }"
          ></svg-icon> -->
          <h3>高效压缩图片，减小文件大小，保持图片质量</h3>
        </div>
      </template>
      <div class="card-body">
        <div class="upload-area t-center hand" @click="handleFileUpload">
          <h3>点击上传图片</h3>
          <p>支持 JPG、PNG、GIF 格式，最大10MB</p>
        </div>

        <div class="controls">
          <div class="control-item">
            <h4><i class="fas fa-sliders-h"></i> 压缩质量</h4>
            <el-slider
              v-model="state.quality"
              :min="10"
              :max="100"
              :step="5"
              @change="handleQualityChange"
              show-input
            ></el-slider>
          </div>
          <div class="control-item">
            <h4><i class="fas fa-expand-arrows-alt"></i> 调整尺寸</h4>
            <el-slider v-model="state.width" :min="10" :max="100" :step="5" show-input></el-slider>
          </div>
          <div class="control-item">
            <h4><i class="fas fa-file-image"></i> 输出格式</h4>
            <el-radio-group v-model="state.activeFormat">
              <el-radio label="jpeg">JPEG</el-radio>
              <el-radio label="png">PNG</el-radio>
              <el-radio label="webp">WEBP</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="t-center">
        <el-button type="primary" :icon="Refresh" @click="compressImage" :loading="state.isCompressing"> 重新压缩 </el-button>
        <el-button type="primary" :icon="Download" @click="downloadCompressedImage"> 下载图片 </el-button>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
@use "./index.scss";
</style>
