<script setup lang="ts" name="compress-image">
import { useMessage } from "@/hooks/message";
import { Download, Refresh, Delete, View, Upload, Setting, Crop, Document } from "@element-plus/icons-vue";
import { ElProgress, ElSlider, ElRadio, ElRadioGroup, ElSwitch, ElImageViewer } from "element-plus";
import { ImageCompressor, CompressOptions, CompressResult, CompressProgress } from "@/utils/compressImage";
import { iconStyle, OriginalImageInfo, StateType } from "./options";
import { FileToDataUrl, generateUUID } from "@/utils/other";
// 压缩器实例
let compressor: ImageCompressor | undefined = undefined;

// 状态管理
const state = reactive<StateType>({
  originalImages: [],
  quality: 80,
  maxWidth: 1920,
  maxHeight: 1080,
  outputFormat: "jpeg",
  enableSmoothing: true,
  enableCustomSize: true,
  isCompressing: false,
  compressProgress: 0,
  previewImages: [],
  showPreview: false,
  currentPreviewIndex: 0
});

// 初始化压缩器
const initCompressor = () => {
  compressor = new ImageCompressor();
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
    FileToDataUrl(file).then(render => {
      const imageInfo: OriginalImageInfo = {
        id: generateUUID(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        imgUrl: render.result as string,
        status: "ready",
        isCompressed: false // 初始状态为未压缩
      };
      state.originalImages.push(imageInfo);
    }).catch(error => {
      useMessage().error(`读取文件 ${file.name} 失败`);
    });
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
const previewImage = (imageInfo: OriginalImageInfo, type: 'original' | 'compressed' = 'original') => {
  const images = [];
  
  // 添加原始图片
  images.push(imageInfo.imgUrl);
  
  // 如果有压缩后的图片，也添加进去
  if (imageInfo.result) {
    images.push(imageInfo.result.dataUrl);
  }
  
  state.previewImages = images;
  state.currentPreviewIndex = type === 'compressed' && imageInfo.result ? 1 : 0;
  state.showPreview = true;
};

// 关闭预览
const closePreview = () => {
  state.showPreview = false;
  state.previewImages = [];
  state.currentPreviewIndex = 0;
};

// 压缩单个图片
const compressSingleImage = async (imageInfo: OriginalImageInfo) => {
  // 如果已经压缩过，直接返回
  if (imageInfo.isCompressed && imageInfo.result) {
    useMessage().info(`图片 ${imageInfo.name} 已经压缩过，跳过压缩`);
    return imageInfo.result;
  }

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
      enableSmoothing: state.enableSmoothing,
      enableCustomSize: state.enableCustomSize,
      onProgress: (progress: CompressProgress) => {
        imageInfo.progress = progress;
      }
    });

    imageInfo.result = result;
    imageInfo.status = "success";
    imageInfo.isCompressed = true; // 标记为已压缩

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
        <div class="upload-area mb20">
          <label for="compress" class="upload-label">
            <div class="upload-content pt40 pb40 pl20 pr20 t-center">
              <el-icon size="48" color="#409eff">
                <Upload />
              </el-icon>
              <h3 class="mt15 mb10">点击上传图片（支持多选）</h3>
              <p class="m-auto">支持 JPG、PNG、WebP 格式，最大 10MB</p>
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
        <div class="controls-panel mt20 mb20 pt20 pb20 pl20 pr20 rounded-10" v-if="state.originalImages.length > 0">
          <div class="control-row flex gap-20 mb20">
            <div class="control-item flex1">
              <label class="control-label flx-align-center gap-8 mb10">
                <el-icon><Setting /></el-icon>
                压缩质量: {{ state.quality }}%
              </label>
              <el-slider v-model="state.quality" :min="10" :max="100" :step="5" show-input class="control-slider" />
            </div>

            <div class="control-item flex1" v-show="state.enableCustomSize">
              <label class="control-label flx-align-center gap-8 mb10">
                <el-icon><Crop /></el-icon>
                最大宽度: {{ state.maxWidth }}px
              </label>
              <el-slider v-model="state.maxWidth" :min="500" :max="4000" :step="100" show-input class="control-slider" />
            </div>

            <div class="control-item flex1" v-show="state.enableCustomSize">
              <label class="control-label flx-align-center gap-8 mb10">
                <el-icon><Crop /></el-icon>
                最大高度: {{ state.maxHeight }}px
              </label>
              <el-slider v-model="state.maxHeight" :min="500" :max="4000" :step="100" show-input class="control-slider" />
            </div>
          </div>

          <div class="control-row flex gap-20 mb20">
            <div class="control-item format-control flex1">
              <label class="control-label flx-align-center gap-8 mb10">
                <el-icon><Document /></el-icon>
                输出格式
              </label>
              <el-radio-group v-model="state.outputFormat">
                <el-radio label="jpeg">JPEG</el-radio>
                <el-radio label="png">PNG</el-radio>
                <el-radio label="webp">WebP</el-radio>
              </el-radio-group>
            </div>
          </div>

          <div class="control-row flex gap-20">
            <div class="control-item switch-control FlexBox gap-12">
              <label class="control-label flx-align-center gap-8">
                <el-icon><Setting /></el-icon>
                高质量渲染
              </label>
              <el-switch v-model="state.enableSmoothing" active-text="开启" inactive-text="关闭" />
            </div>

            <div class="control-item switch-control FlexBox gap-12">
              <label class="control-label flx-align-center gap-8">
                <el-icon><Crop /></el-icon>
                自定义尺寸
              </label>
              <el-switch v-model="state.enableCustomSize" active-text="开启" inactive-text="关闭" />
            </div>
          </div>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="action-buttons flx-center gap-15 mt20 mb20" v-if="state.originalImages.length > 0">
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
      <div class="image-list mt30" v-if="state.originalImages.length > 0">
        <div class="list-header mb20">
          <h4>图片列表 ({{ state.originalImages.length }} 张)</h4>
        </div>

        <div class="image-cards gap-20">
          <div v-for="imageInfo in state.originalImages" :key="imageInfo.id" class="image-card rounded-10 pt15 pb15 pl15 pr15">
            <!-- 图片预览 -->
            <div class="image-preview relative mb15">
              <img :src="imageInfo.imgUrl" :alt="imageInfo.name" @click="previewImage(imageInfo, 'original')" class="wh100 rounded-8" />
              <div class="image-overlay absolute gap-5">
                <el-button type="primary" :icon="View" circle @click="previewImage(imageInfo, 'original')" />
                <el-button type="danger" :icon="Delete" circle @click="removeImage(imageInfo.id)" />
              </div>
            </div>

            <!-- 图片信息 -->
            <div class="image-info">
              <div class="image-name sle mb10" :title="imageInfo.name">
                {{ imageInfo.name }}
              </div>

              <div class="image-details mb15">
                <div class="detail-row flx-justify-between mb5">
                  <span class="label">原始大小:</span>
                  <span class="value">{{ formatFileSize(imageInfo.size) }}</span>
                </div>

                <div class="detail-row flx-justify-between mb5" v-if="imageInfo.result">
                  <span class="label">压缩后:</span>
                  <span class="value success">{{ formatFileSize(imageInfo.result.size) }}</span>
                </div>

                <div class="detail-row flx-justify-between mb5" v-if="imageInfo.result">
                  <span class="label">压缩比:</span>
                  <span class="value success">{{ getCompressionRatio(imageInfo) }}</span>
                </div>

                <div class="detail-row flx-justify-between mb5">
                  <span class="label">状态:</span>
                  <div class="flx-align-center gap-8">
                    <el-tag :type="getStatusType(imageInfo.status)">
                      {{ getStatusText(imageInfo) }}
                    </el-tag>
                    <el-tag v-if="imageInfo.isCompressed" type="success" size="small">
                      已压缩
                    </el-tag>
                  </div>
                </div>
              </div>

              <!-- 进度条 -->
              <div class="progress-section mt15 mb15" v-if="imageInfo.status === 'compressing' && imageInfo.progress">
                <el-progress
                  :percentage="imageInfo.progress.progress"
                  :status="imageInfo.progress.progress === 100 ? 'success' : undefined"
                />
                <div class="progress-text mt5">{{ imageInfo.progress.message }}</div>
              </div>

              <!-- 错误信息 -->
              <div class="error-section mt15 mb15" v-if="imageInfo.status === 'error'">
                <el-alert :title="imageInfo.error || '压缩失败'" type="error" :closable="false" />
              </div>

              <!-- 操作按钮 -->
              <div class="image-actions flex gap-10">
                <el-button
                  v-if="!imageInfo.isCompressed && imageInfo.status !== 'compressing'"
                  type="primary"
                  :icon="Refresh"
                  @click="compressSingleImage(imageInfo)"
                >
                  压缩
                </el-button>

                <el-button
                  v-if="imageInfo.status === 'success'"
                  type="success"
                  :icon="Download"
                  @click="downloadImage(imageInfo)"
                >
                  下载
                </el-button>

                <el-button v-if="imageInfo.result" type="add" :icon="View" @click="previewImage(imageInfo, 'compressed')">
                  预览压缩后
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 图片预览器 -->
    <el-image-viewer
      v-if="state.showPreview"
      :url-list="state.previewImages"
      :initial-index="state.currentPreviewIndex"
      @close="closePreview"
      teleported
    />
  </div>
</template>
<style lang="scss" scoped>
@use "./index.scss";
</style>
