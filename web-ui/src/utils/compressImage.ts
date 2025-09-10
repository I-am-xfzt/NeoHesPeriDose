/**
 * 图片压缩工具类
 * 使用 Canvas 重绘技术对图片进行压缩
 * @version 1.0.0
 * @author neohes-peridose
 * @since 2025-09-09
 */

/**
 * 压缩进度信息接口
 * @interface CompressProgress
 */
export interface CompressProgress {
  /** 当前阶段 */
  stage: 'reading' | 'loading' | 'processing' | 'encoding' | 'complete';
  /** 进度百分比 (0-100) */
  progress: number;
  /** 阶段描述 */
  message: string;
  /** 当前处理的文件索引（批量压缩时） */
  currentIndex?: number;
  /** 总文件数量（批量压缩时） */
  totalCount?: number;
}

/**
 * 压缩结果接口
 * @interface CompressResult
 */
export interface CompressResult {
  /** Base64 格式的压缩后图片数据 */
  dataUrl: string;
  /** 压缩后文件大小（字节） */
  size: number;
  /** 原始文件大小（字节） */
  originalSize: number;
  /** 压缩比率（百分比） */
  compressionRatio: number;
  /** 压缩后图片宽度 */
  width: number;
  /** 压缩后图片高度 */
  height: number;
  /** 压缩耗时（毫秒） */
  duration: number;
}

/**
 * 进度回调函数类型
 * @callback ProgressCallback
 */
export type ProgressCallback = (progress: CompressProgress) => void;

/**
 * 压缩配置选项接口
 * @interface CompressOptions
 */
export interface CompressOptions {
  /** 压缩质量，范围 0-1，默认 0.8 */
  quality?: number;
  /** 最大宽度，默认 1920 */
  maxWidth?: number;
  /** 最大高度，默认 1080 */
  maxHeight?: number;
  /** 输出格式，默认 'jpeg' */
  outputFormat?: 'jpeg' | 'png' | 'webp';
  /** 是否启用高质量渲染，默认 true */
  enableSmoothing?: boolean;
  /** 是否启用自定义尺寸，默认 true，false 时使用原始尺寸 */
  enableCustomSize?: boolean;
  /** 进度回调函数 */
  onProgress?: ProgressCallback;
}

/**
 * 图片压缩器类
 * 提供完整的图片压缩功能，支持单个和批量压缩
 * 
 * @example
 * ```typescript
 * // 创建压缩器实例
 * const compressor = new ImageCompressor();
 * 
 * // 压缩单个图片
 * const file = // 获取的图片文件
 * const result = await compressor.compress(file, {
 *   quality: 0.8,
 *   maxWidth: 1920,
 *   maxHeight: 1080,
 *   outputFormat: 'jpeg'
 * });
 * console.log('压缩结果:', result);
 * 
 * // 批量压缩
 * const files = // 图片文件数组
 * const results = await compressor.compressBatch(files, {
 *   quality: 0.8,
 *   maxWidth: 1920,
 *   maxHeight: 1080
 * });
 * ```
 */
export class ImageCompressor {
  private readonly defaultOptions: Required<Omit<CompressOptions, 'onProgress'>> & { onProgress: ProgressCallback | null } = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    outputFormat: 'jpeg',
    enableSmoothing: true,
    enableCustomSize: true,
    onProgress: null
  };

  /**
   * 创建图片压缩器实例
   * 不需要传入初始化参数，压缩参数在调用压缩方法时传入
   */
  constructor() {
    // 构造函数为空，不需要初始化参数
  }

  /**
   * 压缩单个图片
   * @param file - 要压缩的图片文件
   * @param options - 压缩配置选项（必需）
   * @returns Promise<CompressResult> 压缩结果
   * @throws {Error} 当文件类型不正确或压缩过程中出错时抛出异常
   * 
   * @example
   * ```typescript
   * const compressor = new ImageCompressor();
   * const file = document.querySelector('input[type="file"]').files[0];
   * 
   * try {
   *   const result = await compressor.compress(file, {
   *     quality: 0.8,
   *     maxWidth: 1920,
   *     maxHeight: 1080,
   *     outputFormat: 'jpeg',
   *     enableSmoothing: true,
   *     enableCustomSize: true,
   *     onProgress: (progress) => {
   *       console.log(`${progress.stage}: ${progress.progress}% - ${progress.message}`);
   *     }
   *   });
   *   console.log(`原始大小: ${compressor.formatFileSize(result.originalSize)}`);
   *   console.log(`压缩后大小: ${compressor.formatFileSize(result.size)}`);
   *   console.log(`压缩比率: ${result.compressionRatio}%`);
   * } catch (error) {
   *   console.error('压缩失败:', error.message);
   * }
   * ```
   */
  async compress(file: File, options: CompressOptions): Promise<CompressResult> {
    const startTime = performance.now();
    const finalOptions = { ...this.defaultOptions, ...options };
    const onProgress = finalOptions.onProgress;
    
    // 通知开始读取文件
    onProgress?.({
      stage: 'reading',
      progress: 0,
      message: '正在读取文件...'
    });
    
    return new Promise((resolve, reject) => {
      // 验证文件类型
      if (!this.isValidImageFile(file)) {
        reject(new Error('文件类型不正确，请选择图片文件（支持 JPEG、PNG、WebP 格式）'));
        return;
      }

      const reader = new FileReader();
      const originalSize = file.size;

      reader.onloadstart = () => {
        onProgress?.({
          stage: 'reading',
          progress: 10,
          message: '文件读取中...'
        });
      };

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 30) + 10; // 10-40%
          onProgress?.({
            stage: 'reading',
            progress,
            message: `读取进度: ${Math.round((e.loaded / e.total) * 100)}%`
          });
        }
      };

      reader.onload = (e) => {
        onProgress?.({
          stage: 'loading',
          progress: 40,
          message: '正在加载图片...'
        });

        const img = new Image();

        img.onload = () => {
          try {
            onProgress?.({
              stage: 'processing',
              progress: 60,
              message: '正在处理图片...'
            });

            const { width, height } = finalOptions.enableCustomSize
              ? this.calculateNewDimensions(
                  img.width,
                  img.height,
                  finalOptions.maxWidth,
                  finalOptions.maxHeight
                )
              : { width: img.width, height: img.height };

            const canvas = this.createCanvas(width, height, finalOptions.enableSmoothing);
            const ctx = canvas.getContext('2d')!;
            
            ctx.drawImage(img, 0, 0, width, height);

            onProgress?.({
              stage: 'encoding',
              progress: 80,
              message: '正在编码图片...'
            });

            // 模拟编码进度
            setTimeout(() => {
              try {
                const mimeType = this.getMimeType(finalOptions.outputFormat);
                const dataUrl = canvas.toDataURL(mimeType, finalOptions.quality);
                const compressedSize = this.calculateDataUrlSize(dataUrl);
                const compressionRatio = this.calculateCompressionRatio(originalSize, compressedSize);
                const duration = Math.round(performance.now() - startTime);

                onProgress?.({
                  stage: 'complete',
                  progress: 100,
                  message: '压缩完成'
                });

                resolve({
                  dataUrl,
                  size: compressedSize,
                  originalSize,
                  compressionRatio,
                  width,
                  height,
                  duration
                });
              } catch (err) {
                reject(new Error(`编码过程中发生错误: ${err instanceof Error ? err.message : '未知错误'}`));
              }
            }, 100); // 给用户一些时间看到编码阶段
          } catch (err) {
            reject(new Error(`压缩过程中发生错误: ${err instanceof Error ? err.message : '未知错误'}`));
          }
        };

        img.onerror = () => reject(new Error('加载图片失败，请检查图片文件是否损坏'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('读取文件失败，请检查文件是否可访问'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * 批量压缩图片
   * @param files - 图片文件数组
   * @param options - 压缩配置选项（必需）
   * @param onBatchProgress - 批量进度回调函数（可选）
   * @returns Promise<CompressResult[]> 压缩结果数组
   * 
   * @example
   * ```typescript
   * const compressor = new ImageCompressor();
   * const files = Array.from(document.querySelector('input[type="file"]').files);
   * 
   * const results = await compressor.compressBatch(files, {
   *   quality: 0.8,
   *   maxWidth: 1920,
   *   maxHeight: 1080,
   *   outputFormat: 'jpeg',
   *   onProgress: (progress) => {
   *     // 单个文件的进度
   *     console.log(`文件 ${progress.currentIndex + 1}/${progress.totalCount}: ${progress.progress}%`);
   *   }
   * }, (current, total, overallProgress) => {
   *   // 整体批量进度
   *   console.log(`批量进度: ${current}/${total} (${overallProgress}%)`);
   * });
   * 
   * console.log('批量压缩完成:', results);
   * ```
   */
  async compressBatch(
    files: File[],
    options: CompressOptions,
    onBatchProgress?: (current: number, total: number, overallProgress: number) => void
  ): Promise<CompressResult[]> {
    const results: CompressResult[] = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // 为每个文件创建带批量信息的进度回调
        const fileOptions: CompressOptions = {
          ...options,
          onProgress: (progress: CompressProgress) => {
            // 添加批量信息
            const batchProgress: CompressProgress = {
              ...progress,
              currentIndex: i,
              totalCount: total
            };
            
            // 调用原始的进度回调
            options?.onProgress?.(batchProgress);
          }
        };

        const result = await this.compress(file, fileOptions);
        results.push(result);
        
        // 计算整体进度
        const overallProgress = Math.round(((i + 1) / total) * 100);
        onBatchProgress?.(i + 1, total, overallProgress);
        
      } catch (error) {
        console.error(`压缩文件 ${file.name} 失败:`, error);
        throw new Error(`批量压缩失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }

    return results;
  }

  /**
   * 将 Base64 数据 URL 转换为 File 对象
   * @param dataUrl - Base64 数据 URL
   * @param filename - 文件名
   * @returns File 对象
   * 
   * @example
   * ```typescript
   * const compressor = new ImageCompressor();
   * const result = await compressor.compress(file);
   * const compressedFile = compressor.dataUrlToFile(result.dataUrl, 'compressed.jpg');
   * ```
   */
  dataUrlToFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);

    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
  }

  /**
   * 格式化文件大小显示
   * @param bytes - 字节数
   * @returns 格式化后的大小字符串
   * 
   * @example
   * ```typescript
   * const compressor = new ImageCompressor();
   * console.log(compressor.formatFileSize(1024)); // "1 KB"
   * console.log(compressor.formatFileSize(1048576)); // "1 MB"
   * ```
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * 获取默认配置
   * @returns 默认压缩配置
   */
  getDefaultOptions(): Required<Omit<CompressOptions, 'onProgress'>> & { onProgress: ProgressCallback | null } {
    return { ...this.defaultOptions };
  }

  /**
   * 验证是否为有效的图片文件
   * @private
   * @param file - 文件对象
   * @returns 是否为有效图片文件
   */
  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  }

  /**
   * 计算新的图片尺寸，保持宽高比
   * @private
   * @param originalWidth - 原始宽度
   * @param originalHeight - 原始高度
   * @param maxWidth - 最大宽度
   * @param maxHeight - 最大高度
   * @returns 新的宽度和高度
   */
  private calculateNewDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let width = originalWidth;
    let height = originalHeight;

    // 按宽度缩放
    if (width > maxWidth) {
      const ratio = maxWidth / width;
      width = maxWidth;
      height = Math.round(height * ratio);
    }

    // 按高度缩放
    if (height > maxHeight) {
      const ratio = maxHeight / height;
      height = maxHeight;
      width = Math.round(width * ratio);
    }

    return { width, height };
  }

  /**
   * 创建 Canvas 元素并配置渲染选项
   * @private
   * @param width - 画布宽度
   * @param height - 画布高度
   * @param enableSmoothing - 是否启用平滑渲染
   * @returns Canvas 元素
   */
  private createCanvas(width: number, height: number, enableSmoothing: boolean): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('无法获取 Canvas 2D 上下文');
    }

    if (enableSmoothing) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    return canvas;
  }

  /**
   * 获取 MIME 类型
   * @private
   * @param format - 输出格式
   * @returns MIME 类型字符串
   */
  private getMimeType(format: 'jpeg' | 'png' | 'webp'): string {
    const mimeTypes = {
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp'
    };
    return mimeTypes[format] || mimeTypes.jpeg;
  }

  /**
   * 计算 Base64 数据 URL 的大小（字节）
   * @private
   * @param dataUrl - Base64 数据 URL
   * @returns 大小（字节）
   */
  private calculateDataUrlSize(dataUrl: string): number {
    const base64String = dataUrl.split(',')[1];
    return Math.round((base64String.length * 3) / 4);
  }

  /**
   * 计算压缩比率
   * @private
   * @param originalSize - 原始大小
   * @param compressedSize - 压缩后大小
   * @returns 压缩比率（百分比）
   */
  private calculateCompressionRatio(originalSize: number, compressedSize: number): number {
    return Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));
  }
}

// 为了保持向后兼容，导出函数式接口
/**
 * 压缩图片（函数式接口）
 * @param file - 要压缩的图片文件
 * @param options - 压缩配置选项
 * @returns Promise<CompressResult> 压缩结果
 * @deprecated 推荐使用 ImageCompressor 类
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<CompressResult> {
  const compressor = new ImageCompressor();
  const defaultOptions = compressor.getDefaultOptions();
  const finalOptions: CompressOptions = { 
    ...defaultOptions, 
    ...options,
    onProgress: options.onProgress || undefined
  };
  return compressor.compress(file, finalOptions);
}

/**
 * 批量压缩图片（函数式接口）
 * @param files - 图片文件数组
 * @param options - 压缩配置选项
 * @returns Promise<CompressResult[]> 压缩结果数组
 * @deprecated 推荐使用 ImageCompressor 类
 */
export async function compressImages(
  files: File[],
  options: CompressOptions = {}
): Promise<CompressResult[]> {
  const compressor = new ImageCompressor();
  const defaultOptions = compressor.getDefaultOptions();
  const finalOptions: CompressOptions = { 
    ...defaultOptions, 
    ...options,
    onProgress: options.onProgress || undefined
  };
  return compressor.compressBatch(files, finalOptions);
}

/**
 * 将 dataURL 转换为 File 对象（函数式接口）
 * @param dataUrl - Base64 数据 URL
 * @param filename - 文件名
 * @returns File 对象
 * @deprecated 推荐使用 ImageCompressor 类的实例方法
 */
export function dataUrlToFile(dataUrl: string, filename: string): File {
  const compressor = new ImageCompressor();
  return compressor.dataUrlToFile(dataUrl, filename);
}

/**
 * 格式化文件大小显示（函数式接口）
 * @param bytes - 字节数
 * @returns 格式化后的大小字符串
 * @deprecated 推荐使用 ImageCompressor 类的实例方法
 */
export function formatFileSize(bytes: number): string {
  const compressor = new ImageCompressor();
  return compressor.formatFileSize(bytes);
}

// 默认导出
export default ImageCompressor;