<template>
  <div class="croppers-container layout-pd">
    <el-card shadow="hover" header="cropper 图片裁剪">
      <el-alert
        title="感谢优秀的 `cropperjs`，项目地址：https://github.com/fengyuanchen/cropperjs"
        type="primary"
        :closable="false"
        class="mb15"
      ></el-alert>
      <div v-if="state.cropperImg" class="cropper-img-warp">
        <div class="mb15 mt15">
          <img class="cropper-img" :src="state.cropperImg" />
        </div>
        <el-button type="primary" size="default" @click="onCropperDialogOpen"> 开始裁剪 </el-button>
      </div>
      <div class="t-center" v-else>
        <el-button type="primary">
          <label for="avatar" style="cursor: pointer; display: block; width: 100%; height: 100%">
            <input style="display: none" type="file" name="avatar" id="avatar" accept="image/*" @change="avatarUp" />
            上传图片
          </label>
        </el-button>
      </div>
    </el-card>
    <CropperDialog ref="cropperDialogRef" />
  </div>
</template>

<script setup lang="ts" name="funCropper">
import { FileToDataUrl } from "@/utils/other";

// 引入组件
const CropperDialog = defineAsyncComponent(() => import("./cropperCom.vue"));

// 定义变量内容
const cropperDialogRef = ref();
const state = reactive({
  cropperImg: ""
});
const avatarUp = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files![0];
  if (!file) return;
  const render = await FileToDataUrl(file)
  state.cropperImg = render.result as string;
};
// 打开裁剪弹窗
const onCropperDialogOpen = () => {
  cropperDialogRef.value.openDialog(state.cropperImg);
};
</script>

<style scoped lang="scss">
.croppers-container {
  .cropper-img-warp {
    text-align: center;
    .cropper-img {
      margin: auto;
      width: 150px;
      height: 150px;
      border-radius: 100%;
    }
  }
}
</style>
