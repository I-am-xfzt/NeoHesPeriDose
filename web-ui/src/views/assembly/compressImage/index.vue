<script setup lang="ts" name="compress-image">
import { useMessage } from "@/hooks/message";
import { Download, Refresh, Delete, View, Upload, Setting, Crop, Document } from "@element-plus/icons-vue";
import { ElProgress, ElSlider, ElRadioButton, ElRadioGroup } from "element-plus";
import { ImageCompressor, CompressOptions, CompressResult, CompressProgress } from "@/utils/compressImage";
import theDialog from "@/components/Dialog/index.vue";
// 图标样式
const iconStyle = {
  width: "16px",
  height: "16px",
  fill: "#fff"
};

// 原始图片信息接口
interface OriginalImageInfo {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  imgUrl: string;
  status: "ready" | "compressing" | "success" | "error";
  progress?: CompressProgress;
  result?: CompressResult;
  error?: string;
}

// 状态管理接口
interface StateType {
  originalImages: OriginalImageInfo[];
  quality: number;
  maxWidth: number;
  maxHeight: number;
  outputFormat: "jpeg" | "png" | "webp";
  isCompressing: boolean;
  compressProgress: number;
  previewImage: string;
  showPreview: boolean;
}

// 压缩器实例
let compressor: ImageCompressor | undefined = undefined;

// 状态管理
const state = reactive<StateType>({
  originalImages: [],
  quality: 80,
  maxWidth: 1920,
  maxHeight: 1080,
  outputFormat: "jpeg",
  isCompressing: false,
  compressProgress: 0,
  previewImage: "",
  showPreview: false
});

// 初始化压缩器
const initCompressor = () => {
  compressor = new ImageCompressor({
    quality: state.quality / 100,
    maxWidth: state.maxWidth,
    maxHeight: state.maxHeight,
    outputFormat: state.outputFormat
  });
};

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 文件上传处理
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0) {
    return;
  }

  // 验证文件类型和大小
  for (const file of Array.from(files)) {
    if (!file.type.startsWith("image/")) {
      useMessage().error(`文件 ${file.name} 不是有效的图片格式`);
      continue;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB限制
      useMessage().error(`文件 ${file.name} 超过10MB大小限制`);
      continue;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const imageInfo: OriginalImageInfo = {
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        imgUrl: e.target?.result as string,
        status: "ready"
      };

      state.originalImages.push(imageInfo);
    };

    reader.onerror = () => {
      useMessage().error(`读取文件 ${file.name} 失败`);
    };

    reader.readAsDataURL(file);
  }

  // 清空input值，允许重复选择同一文件
  target.value = "";
};

// 删除图片
const removeImage = (id: string) => {
  const index = state.originalImages.findIndex(img => img.id === id);
  if (index > -1) {
    state.originalImages.splice(index, 1);
    useMessage().success("已删除图片");
  }
};

// 预览图片
const previewImage = (imgUrl: string) => {
  state.previewImage = imgUrl;
  state.showPreview = true;
};

// 压缩单个图片
const compressSingleImage = async (imageInfo: OriginalImageInfo) => {
  if (!compressor) {
    initCompressor();
  }

  imageInfo.status = "compressing";

  try {
    const result = await compressor!.compress(imageInfo.file, {
      quality: state.quality / 100,
      maxWidth: state.maxWidth,
      maxHeight: state.maxHeight,
      outputFormat: state.outputFormat,
      onProgress: (progress: CompressProgress) => {
        imageInfo.progress = progress;
      }
    });

    imageInfo.result = result;
    imageInfo.status = "success";

    return result;
  } catch (error) {
    imageInfo.error = error instanceof Error ? error.message : "压缩失败";
    imageInfo.status = "error";
    throw error;
  }
};

// 压缩所有图片
const compressAllImages = async () => {
  if (state.originalImages.length === 0) {
    useMessage().error("请先选择图片！");
    return;
  }

  state.isCompressing = true;
  state.compressProgress = 0;

  try {
    const totalImages = state.originalImages.length;
    let completedCount = 0;

    // 并发压缩所有图片
    const compressPromises = state.originalImages.map(async imageInfo => {
      try {
        await compressSingleImage(imageInfo);
        completedCount++;
        state.compressProgress = Math.round((completedCount / totalImages) * 100);
      } catch (error) {
        console.error(`压缩图片 ${imageInfo.name} 失败:`, error);
      }
    });

    await Promise.all(compressPromises);

    const successCount = state.originalImages.filter(img => img.status === "success").length;
    const errorCount = state.originalImages.filter(img => img.status === "error").length;

    if (successCount > 0) {
      useMessage().success(`压缩完成！成功: ${successCount}张，失败: ${errorCount}张`);
    } else {
      useMessage().error("所有图片压缩失败");
    }
  } catch (error) {
    useMessage().error("批量压缩过程中发生错误");
    console.error("批量压缩错误:", error);
  } finally {
    state.isCompressing = false;
  }
};

// 下载单个压缩图片
const downloadImage = (imageInfo: OriginalImageInfo) => {
  if (!imageInfo.result) {
    useMessage().error("请先压缩图片");
    return;
  }

  try {
    const link = document.createElement("a");
    link.href = imageInfo.result.dataUrl;
    link.download = `compressed_${imageInfo.name.split(".")[0]}.${state.outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    useMessage().success(`已下载 ${imageInfo.name}`);
  } catch (error) {
    useMessage().error("下载失败");
    console.error("下载错误:", error);
  }
};

// 批量下载所有压缩图片
const downloadAllImages = () => {
  const successImages = state.originalImages.filter(img => img.status === "success" && img.result);

  if (successImages.length === 0) {
    useMessage().error("没有可下载的压缩图片");
    return;
  }

  successImages.forEach((imageInfo, index) => {
    setTimeout(() => {
      downloadImage(imageInfo);
    }, index * 200); // 间隔下载，避免浏览器阻止
  });
};

// 清空所有图片
const clearAllImages = () => {
  state.originalImages = [];
  state.compressProgress = 0;
  useMessage().success("已清空所有图片");
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 获取压缩比率显示
const getCompressionRatio = (imageInfo: OriginalImageInfo): string => {
  if (!imageInfo.result) return "-";
  return `${imageInfo.result.compressionRatio}%`;
};

// 获取状态文本
const getStatusText = (imageInfo: OriginalImageInfo): string => {
  switch (imageInfo.status) {
    case "ready":
      return "待压缩";
    case "compressing":
      return "压缩中...";
    case "success":
      return "压缩成功";
    case "error":
      return "压缩失败";
    default:
      return "未知状态";
  }
};

// 获取状态标签类型
const getStatusType = (status: string): string => {
  switch (status) {
    case "ready":
      return "primary";
    case "compressing":
      return "warning";
    case "success":
      return "success";
    case "error":
      return "danger";
    default:
      return "info";
  }
};

// 监听设置变化，重新初始化压缩器
watch([() => state.quality, () => state.maxWidth, () => state.maxHeight, () => state.outputFormat], () => {
  initCompressor();
});

// 初始化
onMounted(() => {
  initCompressor();
});
</script>
<template>
  <div class="page-container">
    <el-card class="compress-card">
      <template #header>
        <div>
          <h3>高效压缩图片，减小文件大小，保持图片质量</h3>
        </div>
      </template>
      <el-alert
        title="采用HTML5-canvasApi高效压缩图片，减小文件大小，无需上传至服务器，在浏览器中完成压缩"
        type="primary"
        :closable="false"
        class="mb15"
      ></el-alert>
      <div class="card-body">
        <div class="upload-area">
          <label for="compress" class="upload-label">
            <div class="upload-content">
              <el-icon size="48" color="#409eff">
                <Upload />
              </el-icon>
              <h3>点击上传图片（支持多选）</h3>
              <p>支持 JPG、PNG、WebP 格式，最大 10MB</p>
            </div>
            <input
              type="file"
              @change="handleFileUpload"
              name="compress"
              :multiple="true"
              id="compress"
              accept="image/*"
              class="upload-input"
            />
          </label>
        </div>

        <!-- 控制面板 -->
        <div class="controls-panel" v-if="state.originalImages.length > 0">
          <div class="control-row">
            <div class="control-item">
              <label class="control-label">
                <el-icon><Setting /></el-icon>
                压缩质量: {{ state.quality }}%
              </label>
              <el-slider v-model="state.quality" :min="10" :max="100" :step="5" show-input class="control-slider" />
            </div>

            <div class="control-item">
              <label class="control-label">
                <el-icon><Crop /></el-icon>
                最大宽度: {{ state.maxWidth }}px
              </label>
              <el-slider v-model="state.maxWidth" :min="500" :max="4000" :step="100" show-input class="control-slider" />
            </div>

            <div class="control-item">
              <label class="control-label">
                <el-icon><Crop /></el-icon>
                最大高度: {{ state.maxHeight }}px
              </label>
              <el-slider v-model="state.maxHeight" :min="500" :max="4000" :step="100" show-input class="control-slider" />
            </div>
          </div>

          <div class="control-row">
            <div class="control-item format-control">
              <label class="control-label">
                <el-icon><Document /></el-icon>
                输出格式
              </label>
              <el-radio-group v-model="state.outputFormat">
                <el-radio-button label="jpeg">JPEG</el-radio-button>
                <el-radio-button label="png">PNG</el-radio-button>
                <el-radio-button label="webp">WebP</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="action-buttons" v-if="state.originalImages.length > 0">
        <el-button type="primary" :icon="Refresh" @click="compressAllImages" :loading="state.isCompressing">
          {{ state.isCompressing ? `压缩中... ${state.compressProgress}%` : "开始压缩" }}
        </el-button>

        <el-button
          type="success"
          :icon="Download"
          @click="downloadAllImages"
          :disabled="state.originalImages.filter(img => img.status === 'success').length === 0"
        >
          批量下载
        </el-button>

        <el-button type="danger" :icon="Delete" @click="clearAllImages"> 清空列表 </el-button>
      </div>

      <!-- 图片列表 -->
      <div class="image-list" v-if="state.originalImages.length > 0">
        <div class="list-header">
          <h4>图片列表 ({{ state.originalImages.length }} 张)</h4>
        </div>

        <div class="image-cards">
          <div v-for="imageInfo in state.originalImages" :key="imageInfo.id" class="image-card">
            <!-- 图片预览 -->
            <div class="image-preview">
              <img :src="imageInfo.imgUrl" :alt="imageInfo.name" @click="previewImage(imageInfo.imgUrl)" />
              <div class="image-overlay">
                <el-button type="primary" :icon="View" circle @click="previewImage(imageInfo.imgUrl)" />
                <el-button type="danger" :icon="Delete" circle @click="removeImage(imageInfo.id)" />
              </div>
            </div>

            <!-- 图片信息 -->
            <div class="image-info">
              <div class="image-name" :title="imageInfo.name">
                {{ imageInfo.name }}
              </div>

              <div class="image-details">
                <div class="detail-row">
                  <span class="label">原始大小:</span>
                  <span class="value">{{ formatFileSize(imageInfo.size) }}</span>
                </div>

                <div class="detail-row" v-if="imageInfo.result">
                  <span class="label">压缩后:</span>
                  <span class="value success">{{ formatFileSize(imageInfo.result.size) }}</span>
                </div>

                <div class="detail-row" v-if="imageInfo.result">
                  <span class="label">压缩比:</span>
                  <span class="value success">{{ getCompressionRatio(imageInfo) }}</span>
                </div>

                <div class="detail-row">
                  <span class="label">状态:</span>
                  <el-tag :type="getStatusType(imageInfo.status)">
                    {{ getStatusText(imageInfo) }}
                  </el-tag>
                </div>
              </div>

              <!-- 进度条 -->
              <div class="progress-section" v-if="imageInfo.status === 'compressing' && imageInfo.progress">
                <el-progress
                  :percentage="imageInfo.progress.progress"
                  :status="imageInfo.progress.progress === 100 ? 'success' : undefined"
                />
                <div class="progress-text">{{ imageInfo.progress.message }}</div>
              </div>

              <!-- 错误信息 -->
              <div class="error-section" v-if="imageInfo.status === 'error'">
                <el-alert :title="imageInfo.error || '压缩失败'" type="error" :closable="false" />
              </div>

              <!-- 操作按钮 -->
              <div class="image-actions">
                <el-button
                  v-if="imageInfo.status === 'success'"
                  type="primary"
                  :icon="Download"
                  @click="downloadImage(imageInfo)"
                >
                  下载
                </el-button>

                <el-button v-if="imageInfo.result" type="info" :icon="View" @click="previewImage(imageInfo.result.dataUrl)">
                  预览压缩后
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 图片预览对话框 -->
    <the-dialog v-model:vis="state.showPreview" title="图片预览" width="80%" center>
      <div class="preview-container">
        <img :src="state.previewImage" alt="预览图片" class="preview-image" />
      </div>
    </the-dialog>
  </div>
</template>
<style lang="scss" scoped>
@use "./index.scss";
</style>
