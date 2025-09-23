<template>
  <div class="page-container wh100">
    <el-card header="文件上传">
      <div class="upload-header">
        <!-- 使用上传核心组件 -->
        <UploadCoreComponent
          ref="uploadCore"
          :accept="accept"
          :multiple="multiple"
          v-model:upload-type="uploadType"
          :max-size="maxSize"
          :allowed-extensions="allowedExtensions"
          :show-upload-type-option="showUploadTypeOption"
          :show-progress="showProgress"
          :show-progress-text="showProgressText"
          @file-selected="handleFileSelected"
          @upload-start="handleUploadStart"
          @upload-progress="handleUploadProgress"
          @upload-success="handleUploadSuccess"
          @upload-error="handleUploadError"
          @upload-complete="handleUploadComplete"
        />

        <div class="upload-actions" v-if="fileList.length > 0">
          <div class="file-summary">
            <el-tag type="info" size="small">
              总数: {{ fileList.length }}
            </el-tag>
            <el-tag type="success" size="small">
              已选中: {{ selectedFiles.length }}
            </el-tag>
          </div>
          
          <div class="action-buttons">
            <el-button 
              type="success" 
              @click="uploadSelectedFiles" 
              :disabled="selectedFiles.length === 0 || isUploading"
              :loading="isUploading"
            >
              <el-icon><Upload /></el-icon>
              一键上传 ({{ selectedFiles.length }})
            </el-button>
            <el-button 
              type="danger" 
              @click="deleteSelectedFiles" 
              :disabled="selectedFiles.length === 0 || isUploading"
            >
              <el-icon><Delete /></el-icon>
              一键删除 ({{ selectedFiles.length }})
            </el-button>
          </div>
        </div>
      </div>

      <div class="file-table">
        <fyh-table
          v-if="fileList.length > 0"
          v-loading="loading"
          :data="fileList"
          :module-path="modelPath"
          :show-selection="true"
          @selection-change="handleSelectionChange"
          empty-text="暂无文件"
        >
          <!-- 自定义状态槽 -->
          <template #status="{ row }">
            <el-tag
              :type="row.status === 'success' ? 'success' : row.status === 'error' ? 'danger' : row.status === 'uploading' ? 'warning' : 'info'"
              size="small"
            >
              {{ 
                row.status === 'success' ? '已上传' : 
                row.status === 'error' ? '上传失败' : 
                row.status === 'uploading' ? '上传中' : 
                '待上传' 
              }}
            </el-tag>
          </template>
          
          <!-- 自定义进度槽 -->
          <template #progress="{ row }">
            <el-progress
              v-if="row.progress !== undefined"
              :percentage="row.progress"
              :status="row.status === 'success' ? 'success' : row.status === 'error' ? 'exception' : ''"
            />
            <span v-else>-</span>
          </template>
          
          <!-- 自定义操作槽 -->
          <template #operation="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="uploadFile(row)"
              :disabled="row.status === 'success' || row.uploading || isUploading"
              :loading="row.uploading"
            >
              <el-icon><Upload /></el-icon>
              {{ row.uploading ? '上传中' : '上传' }}
            </el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="deleteFile(row)" 
              :disabled="row.uploading || isUploading"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </fyh-table>
        
        <!-- 空状态提示 -->
        <div v-else class="empty-state">
          <el-empty description="请先选择文件进行上传" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="assembly-upload">
import { useMessage } from "@/hooks/message";
import { Upload, Delete } from "@element-plus/icons-vue";
import UploadCoreComponent from "./components/index.vue";
import FyhTable from "@/components/FyhComs/FyhTable.vue";

// 文件项接口定义
interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  file: File | null;
  status: "pending" | "uploading" | "success" | "error";
  progress?: number;
  uploading?: boolean;
}

// 组件属性接口
interface UploadPageProps {
  // 允许的文件类型
  accept?: string;
  // 是否支持多选
  multiple?: boolean;
  // 默认上传类型
  defaultUploadType?: "file" | "folder";
  // 最大文件大小限制（字节）
  maxSize?: number;
  // 允许的文件扩展名
  allowedExtensions?: string[];
  // 是否显示上传类型选项
  showUploadTypeOption?: boolean;
  // 是否显示上传进度
  showProgress?: boolean;
  // 是否显示进度文本
  showProgressText?: boolean;
}

// 定义组件的props
const props = withDefaults(defineProps<UploadPageProps>(), {
  accept: "*",
  multiple: true,
  defaultUploadType: "file",
  maxSize: 1024 * 1024 * 100, // 默认100MB
  allowedExtensions: () => [],
  showUploadTypeOption: true,
  showProgress: true,
  showProgressText: true
});

const emit = defineEmits<{
  "upload-success": [files: FileItem[]];
  "upload-error": [error: Error];
  "file-list-change": [files: FileItem[]];
}>();

// 组件引用和常量定义
const uploadCore = ref<InstanceType<typeof UploadCoreComponent>>();
const modelPath = `views/assembly/uploadFile`;
const uploadType = ref<"file" | "folder">(props.defaultUploadType);
const fileList = ref<FileItem[]>([]);
const selectedFiles = ref<FileItem[]>([]);
const loading = ref(false);
const isUploading = ref(false);

// 处理文件选择事件
const handleFileSelected = (files: FileItem[]) => {
  fileList.value = [...fileList.value, ...files];
  emit("file-list-change", fileList.value);
};

// 处理上传开始事件
const handleUploadStart = (file: File) => {
  // 找到对应的文件项并更新状态
  const fileItem = fileList.value.find(item => item.file === file);
  if (fileItem) {
    fileItem.uploading = true;
    fileItem.status = "uploading";
    fileItem.progress = 0;
  }
};

// 处理上传进度事件
const handleUploadProgress = (percentage: number, file: File) => {
  // 找到对应的文件项并更新进度
  const fileItem = fileList.value.find(item => item.file === file);
  if (fileItem) {
    fileItem.progress = percentage;
  }
};

// 处理上传成功事件
const handleUploadSuccess = (response: any, file: File) => {
  // 找到对应的文件项并更新状态
  const fileItem = fileList.value.find(item => item.file === file);
  if (fileItem) {
    fileItem.status = "success";
    fileItem.progress = 100;
    fileItem.uploading = false;
  }
};

// 处理上传失败事件
const handleUploadError = (error: Error, file: File) => {
  // 找到对应的文件项并更新状态
  const fileItem = fileList.value.find(item => item.file === file);
  if (fileItem) {
    fileItem.status = "error";
    fileItem.uploading = false;
  }
};

// 处理上传完成事件
const handleUploadComplete = (file: File) => {
  // 检查是否所有文件都上传完成
  const isAllUploadingComplete = fileList.value.every(item => !item.uploading);
  if (isAllUploadingComplete) {
    isUploading.value = false;
  }
};

// 处理选择变化
const handleSelectionChange = (selection: FileItem[]) => {
  selectedFiles.value = selection;
};

// 上传单个文件
const uploadFile = async (fileItem: FileItem) => {
  if (!fileItem.file || fileItem.status === "success" || fileItem.uploading || isUploading.value) {
    return;
  }

  isUploading.value = true;

  try {
    await uploadCore.value?.uploadFile(fileItem.file);
  } catch (error) {
    // 错误处理已经在组件内部完成
  } finally {
    // 检查是否所有文件都上传完成
    const isAllUploadingComplete = fileList.value.every(item => !item.uploading);
    if (isAllUploadingComplete) {
      isUploading.value = false;
    }
  }
};

// 上传选中的文件
const uploadSelectedFiles = async () => {
  if (selectedFiles.value.length === 0 || isUploading.value) {
    useMessage().warning("请先选择要上传的文件");
    return;
  }

  loading.value = true;
  isUploading.value = true;

  try {
    const filesToUpload = selectedFiles.value
      .filter(file => file.file && file.status !== "success" && !file.uploading)
      .map(file => file.file!);

    if (filesToUpload.length === 0) {
      useMessage().info("没有需要上传的文件");
      return;
    }

    await uploadCore.value?.uploadFiles(filesToUpload);

    // 收集所有上传成功的文件
    const successfulFiles = fileList.value.filter(file => file.status === "success");
    if (successfulFiles.length > 0) {
      emit("upload-success", successfulFiles);
    }
  } catch (error) {
    console.error('上传过程中发生错误:', error);
    useMessage().error("上传过程中发生错误");
    emit("upload-error", error as Error);
  } finally {
    loading.value = false;
    isUploading.value = false;
  }
};

// 删除单个文件
const deleteFile = (fileItem: FileItem) => {
  if (fileItem.uploading || isUploading.value) {
    useMessage().warning("文件正在上传中，无法删除");
    return;
  }

  const index = fileList.value.findIndex(file => file.id === fileItem.id);
  if (index !== -1) {
    fileList.value.splice(index, 1);
    emit("file-list-change", fileList.value);
    useMessage().success(`${fileItem.name} 已删除`);
  }
};

// 删除选中的文件
const deleteSelectedFiles = () => {
  if (selectedFiles.value.length === 0) {
    useMessage().warning("请先选择要删除的文件");
    return;
  }

  if (selectedFiles.value.some(file => file.uploading) || isUploading.value) {
    useMessage().warning("部分文件正在上传中，无法删除");
    return;
  }

  const selectedIds = selectedFiles.value.map(file => file.id);
  const deletedCount = selectedIds.length;
  
  fileList.value = fileList.value.filter(file => !selectedIds.includes(file.id));
  selectedFiles.value = [];
  
  emit("file-list-change", fileList.value);
  useMessage().success(`已删除 ${deletedCount} 个文件`);
};

// 暴露方法给父组件
defineExpose({
  uploadFile,
  uploadSelectedFiles,
  deleteFile,
  deleteSelectedFiles,
  fileList,
  selectedFiles
});
</script>

<style scoped lang="scss">
.upload-header {
  margin-bottom: 20px;
}

.upload-actions {
  margin-top: 20px;
  
  .file-summary {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    align-items: center;
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}

.file-table {
  margin-top: 20px;
  
  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    background-color: #fafafa;
    border-radius: 8px;
    border: 1px dashed #dcdfe6;
  }
}

.el-progress {
  margin-top: 4px;
}

.el-icon {
  vertical-align: middle;
}

// 响应式设计
@media (max-width: 768px) {
  .upload-actions {
    .file-summary {
      flex-wrap: wrap;
    }
    
    .action-buttons {
      flex-direction: column;
      
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
