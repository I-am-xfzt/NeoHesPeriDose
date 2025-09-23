/**
 * 图片压缩工具使用示例
 * @example 展示如何使用 ImageCompressor 类的进度功能
 */

import { ImageCompressor, CompressOptions, CompressResult, CompressProgress } from './compressImage';

/**
 * 带进度显示的基础压缩示例
 */
export async function progressExample() {
  // 创建压缩器实例
  const compressor = new ImageCompressor({
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    outputFormat: 'jpeg'
  });

  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  const file = fileInput.files?.[0];

  if (!file) {
    return;
  }

  try {
    // 压缩图片，带进度回调
    const result = await compressor.compress(file, {
      onProgress: (progress: CompressProgress) => {
        // 可以在这里更新页面的进度条
        updateProgressBar(progress.progress, progress.message);
      }
    });
    
  } catch (error) {
    console.error('压缩失败:', error);
  }
}

/**
 * 批量压缩带双层进度显示示例
 */
export async function batchProgressExample() {
  const compressor = new ImageCompressor({
    quality: 0.7,
    maxWidth: 1200,
    maxHeight: 800,
    outputFormat: 'jpeg'
  });

  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  const files = Array.from(fileInput.files || []);

  if (files.length === 0) {
    return;
  }

  try {
    // 批量压缩，支持双层进度显示
    const results = await compressor.compressBatch(
      files,
      {
        // 单个文件的压缩进度
        onProgress: (progress: CompressProgress) => {
          const { currentIndex = 0, totalCount = 1 } = progress;
          
          // 更新单个文件的进度条
          updateSingleFileProgress(currentIndex, progress.progress, progress.message);
        }
      },
      // 整体批量进度
      (current: number, total: number, overallProgress: number) => {
        // 更新整体进度条
        updateBatchProgress(current, total, overallProgress);
      }
    );
    const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalCompressedSize = results.reduce((sum, r) => sum + r.size, 0);
    const averageRatio = Math.round(results.reduce((sum, r) => sum + r.compressionRatio, 0) / results.length);

  } catch (error) {
    console.error('批量压缩失败:', error);
  }
}

/**
 * Vue 组件中使用进度功能的示例
 */
export class VueProgressImageCompressor {
  private compressor: ImageCompressor;

  constructor(options?: CompressOptions) {
    this.compressor = new ImageCompressor(options);
  }

  /**
   * 在 Vue 组件中处理单文件上传（带进度）
   */
  async handleSingleFileUpload(
    file: File, 
    onProgress?: (progress: CompressProgress) => void
  ): Promise<CompressResult> {
    return this.compressor.compress(file, {
      onProgress: (progress: CompressProgress) => {
        // 可以直接传递给 Vue 组件的响应式数据
        onProgress?.(progress);
      }
    });
  }

  /**
   * 在 Vue 组件中处理批量文件上传（带双层进度）
   */
  async handleBatchFileUpload(
    files: File[],
    onSingleProgress?: (fileIndex: number, progress: CompressProgress) => void,
    onBatchProgress?: (current: number, total: number, overall: number) => void
  ): Promise<CompressResult[]> {
    return this.compressor.compressBatch(
      files,
      {
        onProgress: (progress: CompressProgress) => {
          const fileIndex = progress.currentIndex ?? 0;
          onSingleProgress?.(fileIndex, progress);
        }
      },
      (current, total, overallProgress) => {
        onBatchProgress?.(current, total, overallProgress);
      }
    );
  }
}

/**
 * 模拟页面进度条更新函数
 */
function updateProgressBar(progress: number, message: string) {
  // 这里可以更新页面上的进度条
  const progressBar = document.querySelector('.progress-bar') as HTMLElement;
  const progressText = document.querySelector('.progress-text') as HTMLElement;
  
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
  
  if (progressText) {
    progressText.textContent = `${progress}% - ${message}`;
  }
}

function updateSingleFileProgress(fileIndex: number, progress: number, message: string) {
  // 更新单个文件的进度显示
  const singleProgressBar = document.querySelector(`#file-${fileIndex}-progress`) as HTMLElement;
  if (singleProgressBar) {
    singleProgressBar.style.width = `${progress}%`;
    singleProgressBar.textContent = message;
  }
}

function updateBatchProgress(current: number, total: number, overallProgress: number) {
  // 更新批量进度显示
  const batchProgressBar = document.querySelector('.batch-progress-bar') as HTMLElement;
  const batchProgressText = document.querySelector('.batch-progress-text') as HTMLElement;
  
  if (batchProgressBar) {
    batchProgressBar.style.width = `${overallProgress}%`;
  }
  
  if (batchProgressText) {
    batchProgressText.textContent = `${current}/${total} 文件已完成 (${overallProgress}%)`;
  }
}

/**
 * React Hook 风格的压缩工具示例
 */
export function useImageCompressor(options?: CompressOptions) {
  const compressor = new ImageCompressor(options);
  
  const compressWithProgress = async (
    file: File,
    onProgress?: (progress: CompressProgress) => void
  ): Promise<CompressResult> => {
    return compressor.compress(file, { onProgress });
  };
  
  const compressBatchWithProgress = async (
    files: File[],
    onSingleProgress?: (progress: CompressProgress) => void,
    onBatchProgress?: (current: number, total: number, overall: number) => void
  ): Promise<CompressResult[]> => {
    return compressor.compressBatch(
      files,
      { onProgress: onSingleProgress },
      onBatchProgress
    );
  };
  
  return {
    compressor,
    compressWithProgress,
    compressBatchWithProgress,
    formatFileSize: compressor.formatFileSize.bind(compressor)
  };
}

// 导出所有示例函数
export default {
  progressExample,
  batchProgressExample,
  VueProgressImageCompressor,
  useImageCompressor
};