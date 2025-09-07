<template>
  <div>
    <the-dialog
      title="更换头像"
      @cancel="onCancel"
      :confirm-text="`更换`"
      @confirm="onSubmit"
      v-model:visible="state.isShowDialog"
      width="769px"
    >
      <div class="cropper-warp">
        <div class="cropper-warp-left"></div>
        <div class="cropper-warp-right">
          <div class="cropper-warp-right-title">预览</div>
          <div class="cropper-warp-right-item">
            <div class="cropper-warp-right-value">
              <img :src="state.cropperImgBase64" class="cropper-warp-right-value-img" />
            </div>
            <div class="cropper-warp-right-label">100 x 100</div>
          </div>
          <div class="cropper-warp-right-item">
            <div class="cropper-warp-right-value">
              <img :src="state.cropperImgBase64" class="cropper-warp-right-value-img cropper-size" />
            </div>
            <div class="cropper-warp-right-label">50 x 50</div>
          </div>
        </div>
      </div>
      <template #other_btn v-if="state.cropperImgBase64">
        <el-button type="add" @click="downloadDataUrl(state.cropperImgBase64)">下载</el-button>
      </template>
    </the-dialog>
  </div>
</template>

<script setup lang="ts" name="cropper">
import theDialog from "@/components/Dialog/index.vue";
import Cropper from "cropperjs";
import "./cropper.min.css";

// 定义变量内容
const state = reactive({
  isShowDialog: false,
  cropperImg: "",
  cropperImgBase64: "",
  cropper: "" as RefType
});

// 打开弹窗
const openDialog = (imgs: string) => {
  state.cropperImg = imgs;
  state.isShowDialog = true;
  nextTick(() => {
    initCropper();
  });
};
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};
// 更换
const onSubmit = async () => {
  const canvas = await state.cropper.getCropperSelection().$toCanvas();
  state.cropperImgBase64 = canvas.toDataURL("image/jpeg");
};
// 初始化cropperjs图片裁剪
const downloadDataUrl = (dataUrl: string, fileName = "image.png") => {
  try {
    // 创建a标签
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;

    // 触发点击下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error("下载失败:", error);
    return false;
  }
};

const initCropper = () => {
  if (state.cropper) return;
  const letImg = new Image();
  letImg.src = state.cropperImg;
  letImg.onload = function (e) {
    state.cropper = new Cropper(letImg, {
      container: ".cropper-warp-left",
      template: `<cropper-canvas style="width:100%; aspect-ratio: ${letImg.naturalWidth / letImg.naturalHeight};" background>
								<cropper-image class="posCenter"></cropper-image>
								<cropper-shade hidden></cropper-shade>
								<cropper-handle action="select" plain></cropper-handle>
								<cropper-selection initial-coverage="0.5" movable resizable>
									<cropper-grid role="grid" bordered covered></cropper-grid>
									<cropper-crosshair centered></cropper-crosshair>
									<cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.2)"></cropper-handle>
									<cropper-handle action="n-resize"></cropper-handle>
									<cropper-handle action="e-resize"></cropper-handle>
									<cropper-handle action="s-resize"></cropper-handle>
									<cropper-handle action="w-resize"></cropper-handle>
									<cropper-handle action="ne-resize"></cropper-handle>
									<cropper-handle action="nw-resize"></cropper-handle>
									<cropper-handle action="se-resize"></cropper-handle>
									<cropper-handle action="sw-resize"></cropper-handle>
								</cropper-selection>
							</cropper-canvas>`
    });
  };
};

// 暴露变量
defineExpose({
  openDialog
});
/**
 * @example 1.0的配置 const image = document.getElementById('image');
	const cropper = new Cropper(image, {
		// 以下是配置参数
		viewMode: 1, // 视图模式：0,1,2,3 :cite[1]:cite[6]
		dragMode: 'move', // 拖拽模式：'crop', 'move', 'none' :cite[1]:cite[6]
		aspectRatio: 16 / 9, // 裁剪框固定宽高比，NaN 为自由比例 :cite[1]:cite[6]
		preview: '.img-preview', // 预览元素的选择器 :cite[1]:cite[6]
		responsive: true, // 窗口大小变化后重新渲染 :cite[1]:cite[6]
		restore: true, // 窗口大小变化后恢复裁剪区域 :cite[1]:cite[6]
		modal: true, // 显示图片和裁剪框之间的黑色蒙版 :cite[1]:cite[6]
		guides: true, // 显示裁剪框的虚线 :cite[1]:cite[6]
		center: true, // 显示裁剪框中心的指示器 :cite[1]:cite[6]
		highlight: true, // 显示裁剪框上的白色蒙版（突出显示）:cite[1]:cite[6]
		background: true, // 在容器内显示网格背景 :cite[1]:cite[6]
		autoCrop: true, // 初始化时自动裁剪图片 :cite[1]:cite[6]
		autoCropArea: 0.8, // 定义自动裁剪区域占图片的大小 (0-1) :cite[1]:cite[6]
		movable: true, // 是否可以移动图片 :cite[1]:cite[6]
		rotatable: true, // 是否可以旋转图片 :cite[1]:cite[6]
		scalable: true, // 是否可以缩放图片（改变长宽）:cite[1]:cite[6]
		zoomable: true, // 是否可以缩放图片（改变焦距）:cite[1]:cite[6]
		zoomOnTouch: true, // 是否可以通过拖拽触摸缩放图片 :cite[1]:cite[6]
		zoomOnWheel: true, // 是否可以通过鼠标滚轮缩放图片 :cite[1]:cite[6]
		wheelZoomRatio: 0.1, // 鼠标滚轮缩放的灵敏度 :cite[1]:cite[6]
		cropBoxMovable: true, // 是否可以拖拽移动裁剪框 :cite[1]:cite[6]
		cropBoxResizable: true, // 是否可以调整裁剪框大小 :cite[1]:cite[6]
		toggleDragModeOnDblclick: true, // 是否可通过双击切换拖拽模式 :cite[1]:cite[6]
		minContainerWidth: 200,
		minContainerHeight: 100,
		minCanvasWidth: 0,
		minCanvasHeight: 0,
		minCropBoxWidth: 0,
		minCropBoxHeight: 0,

		// 事件回调
		ready() {
			console.log('Cropper 准备就绪');
		},
		crop(event) {
			console.log('裁剪事件', event.detail);
			// event.detail 包含 x, y, width, height, rotate, scaleX, scaleY 等详细信息 :cite[1]
		},
		cropstart(event) {
			console.log('裁剪开始', event.detail.action); // 动作类型：'crop'（移动裁剪框）等 :cite[4]
		},
		cropmove(event) {
			console.log('裁剪移动', event.detail.action);
		},
		cropend(event) {
			console.log('裁剪结束', event.detail.action);
		},
		zoom(event) {
			console.log('缩放', event.detail.ratio);
		}
	});
 */
</script>

<style scoped lang="scss">
.cropper-warp {
  display: flex;
  .cropper-warp-left {
    position: relative;
    display: inline-block;
    flex: 1;
    border: 1px solid var(--el-border-color);
    background: var(--el-color-white);
    overflow: hidden;
    background-repeat: no-repeat;
    cursor: move;
    border-radius: var(--el-border-radius-base);
  }
  .cropper-warp-right {
    width: 150px;
    height: 350px;
    .cropper-warp-right-title {
      text-align: center;
      height: 20px;
      line-height: 20px;
    }
    .cropper-warp-right-item {
      margin: 15px 0;
      .cropper-warp-right-value {
        display: flex;
        .cropper-warp-right-value-img {
          width: 100px;
          height: 100px;
          border-radius: var(--el-border-radius-circle);
          margin: auto;
        }
        .cropper-size {
          width: 50px;
          height: 50px;
        }
      }
      .cropper-warp-right-label {
        text-align: center;
        font-size: 12px;
        color: var(--el-text-color-primary);
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
</style>
