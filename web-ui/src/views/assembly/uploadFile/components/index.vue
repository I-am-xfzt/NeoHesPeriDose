<template>
  <div class="upload-component">
    <!-- 拖拽上传区域 -->
    <div
      class="upload-drag-area"
      :class="{ 'is-dragover': isDragging }"
      @click="selectFiles"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
      :disabled="disabled || isUploading"
    >
      <div class="upload-icon">
        <el-icon :size="48">
          <UploadIcon />
        </el-icon>
      </div>
      <div class="upload-text">
        <div class="upload-main-text">点击或拖拽文件到此区域上传</div>
        <div class="upload-sub-text">
          支持单个或批量上传，{{ uploadType === 'folder' ? '可选择文件夹' : '文件大小不超过' + formatFileSize(props.maxSize) }}
        </div>
      </div>
      <div class="upload-hint">
        点击选择文件
      </div>
    </div>
    
    <input
      ref="fileInput"
      type="file"
      :webkitdirectory="uploadType === 'folder'"
      :directory="uploadType === 'folder'"
      :multiple="multiple"
      :accept="accept"
      class="hidden-input"
      @change="handleFileSelect"
    />
    
    <!-- 上传进度条 -->
    <div v-if="showProgress && uploadProgress > 0 && uploadProgress < 100" class="upload-progress-container">
      <el-progress :percentage="uploadProgress" :status="uploadStatus" />
      <span v-if="showProgressText" class="progress-text">{{ progressText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts" name="upload-core-component">
import { useMessage } from "@/hooks/message"
import { Upload as UploadIcon, Plus } from '@element-plus/icons-vue';
import { ElProgress } from 'element-plus';
// 文件项接口定义
interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  file: File | null;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
  uploading?: boolean;
}

// 组件属性接口
interface UploadComponentProps {
  // 允许的文件类型
  accept?: string;
  // 是否支持多选
  multiple?: boolean;
  // 上传类型 'file' | 'folder'
  uploadType?: 'file' | 'folder';
  // 是否禁用组件
  disabled?: boolean;
  // 按钮类型
  buttonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text';
  // 按钮大小
  buttonSize?: 'default' | 'large' | 'small';
  // 按钮文本
  buttonText?: string;
  // 最大文件大小（字节）
  maxSize?: number;
  // 允许的文件扩展名列表
  allowedExtensions?: string[];
  // 是否显示上传类型选择选项
  showUploadTypeOption?: boolean;
  // 是否显示上传进度
  showProgress?: boolean;
  // 是否显示进度文本
  showProgressText?: boolean;
  // 是否显示上传图标
  showUploadIcon?: boolean;
}

// 定义组件的props，设置默认值
const props = withDefaults(defineProps<UploadComponentProps>(), {
  accept: '*',
  multiple: true,
  uploadType: 'file',
  disabled: false,
  buttonType: 'primary',
  buttonSize: 'default',
  buttonText: '',
  maxSize: 1024 * 1024 * 100, // 默认100MB
  allowedExtensions: () => [],
  showUploadTypeOption: true,
  showProgress: true,
  showProgressText: true,
  showUploadIcon: true
});

// 定义组件的事件
const emit = defineEmits<{
  // 文件选择事件
  'file-selected': [files: FileItem[]];
  // 上传开始事件
  'upload-start': [file: File];
  // 上传进度事件
  'upload-progress': [percentage: number, file: File];
  // 上传成功事件
  'upload-success': [response: any, file: File];
  // 上传失败事件
  'upload-error': [error: Error, file: File];
  // 上传完成事件（无论成功或失败）
  'upload-complete': [file: File];
  // 上传类型更新事件
  'update:uploadType': ['file' | 'folder'];
}>();

// 组件内部状态
const fileInput = ref<HTMLInputElement>();
const localUploadType = ref<'file' | 'folder'>(props.uploadType);
const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadStatus = ref<'success' | 'exception' | 'warning' | undefined>(undefined);
const progressText = ref('');
const isDragging = ref(false);

// 计算属性 - 根据配置决定是否显示上传图标
const uploadIcon = computed(() => {
  return props.showUploadIcon ? UploadIcon : undefined;
});

// 监听props中的uploadType变化
watch(() => props.uploadType, (newType) => {
  localUploadType.value = newType;
  onUploadTypeChange();
});

// 当上传类型改变时，重置文件输入并通知父组件
const onUploadTypeChange = () => {
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  // 通知父组件上传类型已经改变
  emit('update:uploadType', localUploadType.value);
};

// 打开文件选择对话框
const selectFiles = () => {
  if (fileInput.value && !props.disabled && !isUploading.value) {
    fileInput.value.click();
  }
};

// 处理拖拽悬停
const handleDragOver = (event: DragEvent) => {
  if (!props.disabled && !isUploading.value) {
    event.preventDefault();
    event.stopPropagation();
    isDragging.value = true;
  }
};

// 处理拖拽离开
const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
  // 只有当拖拽完全离开组件区域时才设置为false
  const currentTarget = event.currentTarget as HTMLElement;
  const relatedTarget = event.relatedTarget as Node;
  if (currentTarget && relatedTarget && !currentTarget.contains(relatedTarget)) {
    isDragging.value = false;
  }
};

// 处理文件放置
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
  isDragging.value = false;
  
  if (props.disabled || isUploading.value) return;
  
  const files = event.dataTransfer?.files;
  if (!files || files.length === 0) {
    useMessage().warning('没有检测到文件');
    return;
  }
  
  // 检查是否支持多文件上传
  if (!props.multiple && files.length > 1) {
    useMessage().warning('只允许上传单个文件');
    return;
  }
  
  // 处理拖放的文件
  handleFileSelect({ target: { files } } as unknown as Event);
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const files = Array.from(input.files);
  
  // 检查是否支持多文件上传
  if (!props.multiple && files.length > 1) {
    useMessage().warning('只允许上传单个文件');
    return;
  }
  
  const newFileItems: FileItem[] = [];
  const rejectedFiles: string[] = [];

  files.forEach(file => {
    if (isAllowedFile(file)) {
      // 对于文件夹上传，使用webkitRelativePath获取完整路径
      const path = localUploadType.value === 'folder' && 'webkitRelativePath' in file 
        ? (file as any).webkitRelativePath 
        : file.name;
      
      newFileItems.push({
        id: generateId(),
        name: file.name,
        size: file.size,
        type: file.type || getFileType(file.name),
        path,
        file,
        status: 'pending'
      });
    } else {
      rejectedFiles.push(file.name);
    }
  });

  // 触发文件选择事件
  if (newFileItems.length > 0) {
    emit('file-selected', newFileItems);
    useMessage().success(`成功添加 ${newFileItems.length} 个文件`);
  }
  
  if (rejectedFiles.length > 0) {
    useMessage().warning(`${rejectedFiles.length} 个文件被拒绝`);
  }

  // 清空文件输入，以便下次选择相同文件
  input.value = '';
};

// 检查文件是否允许上传
const isAllowedFile = (file: File): boolean => {
  // 检查文件大小
  if (file.size > props.maxSize) {
    useMessage().warning(`${file.name} 文件大小超过限制 (${formatFileSize(props.maxSize)})`);
    return false;
  }

  // 检查文件类型
  if (props.accept !== '*') {
    // 支持多种格式，如 "image/*,video/*" 或 ".jpg,.png,.gif"
    const acceptTypes = props.accept.split(',').map(type => type.trim());
    let isValidType = false;
    
    for (const acceptType of acceptTypes) {
      if (acceptType.startsWith('.')) {
        // 文件扩展名检查
        const extension = file.name.toLowerCase().split('.').pop();
        if (extension && acceptType.toLowerCase() === `.${extension}`) {
          isValidType = true;
          break;
        }
      } else if (acceptType.includes('*')) {
        // MIME类型检查 (如 "image/*")
        const [mainType] = acceptType.split('/');
        if (file.type.startsWith(mainType)) {
          isValidType = true;
          break;
        }
      } else {
        // 精确MIME类型检查
        if (file.type === acceptType) {
          isValidType = true;
          break;
        }
      }
    }
    
    if (!isValidType) {
      useMessage().warning(`${file.name} 文件类型不被支持`);
      return false;
    }
  }

  // 检查文件扩展名
  if (props.allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !props.allowedExtensions.map(ext => ext.toLowerCase()).includes(extension)) {
      useMessage().warning(`${file.name} 文件扩展名不被允许`);
      return false;
    }
  }

  return true;
};

// 获取文件类型
const getFileType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (!extension) return 'unknown';
  
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
    return 'image';
  } else if (['mp4', 'avi', 'mov', 'wmv'].includes(extension)) {
    return 'video';
  } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
    return 'audio';
  } else if (['doc', 'docx', 'pdf', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
    return 'document';
  } else {
    return 'other';
  }
};

// 生成唯一ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// 上传文件方法（供外部调用）
const uploadFile = async (file: File): Promise<any> => {
  if (!file || props.disabled) return;

  isUploading.value = true;
  uploadProgress.value = 0;
  uploadStatus.value = undefined;
  progressText.value = `正在上传 ${file.name}`;

  emit('upload-start', file);

  try {
    // 模拟上传过程
    const result = await simulateUpload(file);
    
    uploadProgress.value = 100;
    uploadStatus.value = 'success';
    progressText.value = `${file.name} 上传成功`;
    
    emit('upload-success', result, file);
    useMessage().success(`${file.name} 上传成功`);
    
    return result;
  } catch (error) {
    uploadStatus.value = 'exception';
    progressText.value = `${file.name} 上传失败`;
    
    emit('upload-error', error as Error, file);
    useMessage().error(`${file.name} 上传失败`);
    
    throw error;
  } finally {
    // 延迟重置上传状态，以便用户看到最终状态
    setTimeout(() => {
      isUploading.value = false;
      if (props.showProgress) {
        uploadProgress.value = 0;
        progressText.value = '';
      }
    }, 1000);
    
    emit('upload-complete', file);
  }
};

// 批量上传文件方法（供外部调用）
const uploadFiles = async (files: File[]): Promise<Array<{success: boolean; file: File; result?: any; error?: Error}>> => {
  if (!files || files.length === 0 || props.disabled) return [];

  isUploading.value = true;
  uploadProgress.value = 0;
  uploadStatus.value = undefined;
  progressText.value = `正在上传 ${files.length} 个文件`;

  const results: Array<{success: boolean; file: File; result?: any; error?: Error}> = [];
  
  try {
    // 串行上传文件
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      progressText.value = `正在上传 ${i + 1}/${files.length} - ${file.name}`;
      
      // 计算当前总体进度（基于文件数量）
      const baseProgress = Math.floor((i / files.length) * 100);
      uploadProgress.value = baseProgress;
      
      try {
        emit('upload-start', file);
        const result = await simulateUpload(file, i, files.length);
        results.push({ success: true, file, result });
        emit('upload-success', result, file);
      } catch (error) {
        results.push({ success: false, file, error: error as Error });
        emit('upload-error', error as Error, file);
      } finally {
        emit('upload-complete', file);
        // 更新总体进度
        uploadProgress.value = Math.floor(((i + 1) / files.length) * 100);
      }
    }
    
    uploadStatus.value = results.every(r => r.success) ? 'success' : 'warning';
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    if (successCount > 0) {
      useMessage().success(`成功上传 ${successCount} 个文件`);
    }
    if (failCount > 0) {
      useMessage().error(`有 ${failCount} 个文件上传失败`);
    }
  } finally {
    // 延迟重置上传状态，以便用户看到最终状态
    setTimeout(() => {
      isUploading.value = false;
      if (props.showProgress) {
        uploadProgress.value = 0;
        progressText.value = '';
      }
    }, 1000);
  }
  
  return results;
};

// 模拟上传过程
const simulateUpload = (file: File, fileIndex: number = 0, totalFiles: number = 1): Promise<any> => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      const progressIncrement = Math.random() * 15 + 5; // 5-20% 增量
      progress += progressIncrement;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // 模拟随机失败率（5%的概率失败）
        if (Math.random() < 0.05) {
          reject(new Error('Upload failed: Network error'));
        } else {
          // 模拟返回的数据
          resolve({
            fileId: generateId(),
            fileName: file.name,
            fileSize: file.size,
            uploadTime: new Date().toISOString(),
            url: `https://example.com/uploads/${generateId()}/${file.name}`
          });
        }
      }
      
      // 触发进度事件
      emit('upload-progress', Math.floor(progress), file);
    }, 200);
  });
};

// 暴露方法给父组件
defineExpose({
  uploadFile,
  uploadFiles,
  isUploading,
  uploadProgress
});
</script>

<style scoped lang="scss">
.upload-component {
  display: inline-block;
  position: relative;
  width: 100%;
}

.upload-drag-area {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  background-color: #fafafa;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.upload-drag-area:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.upload-drag-area.is-dragover {
  border-color: #67c23a;
  background-color: #f0f9eb;
}

.upload-drag-area[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}

.upload-icon {
  margin-bottom: 20px;
  color: #c0c4cc;
  transition: color 0.3s;
}

.upload-drag-area:hover .upload-icon,
.upload-drag-area.is-dragover .upload-icon {
  color: #409eff;
}

.upload-text {
  margin-bottom: 16px;
}

.upload-main-text {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.upload-sub-text {
  font-size: 12px;
  color: #909399;
}

.upload-hint {
  font-size: 12px;
  color: #c0c4cc;
  background-color: #fff;
  padding: 4px 12px;
  border-radius: 16px;
  border: 1px solid #e4e7ed;
}

.hidden-input {
  display: none;
}

.upload-progress-container {
  margin-top: 10px;
}

.progress-text {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #606266;
}
</style>