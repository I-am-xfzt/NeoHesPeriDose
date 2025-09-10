import { CompressResult, CompressProgress } from "@/utils/compressImage";
// 图标样式
export const iconStyle = {
  width: "16px",
  height: "16px",
  fill: "#fff"
};

// 原始图片信息接口
export interface OriginalImageInfo {
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
export interface StateType {
  originalImages: OriginalImageInfo[];
  quality: number;
  maxWidth: number;
  maxHeight: number;
  outputFormat: "jpeg" | "png" | "webp";
  enableSmoothing: boolean;
  enableCustomSize: boolean;
  isCompressing: boolean;
  compressProgress: number;
  previewImage: string;
  showPreview: boolean;
}
