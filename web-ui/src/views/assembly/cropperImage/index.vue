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
        <el-button type="primary" size="default" @click="onCropperDialogOpen"> 更换头像 </el-button>
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
// 引入组件
const CropperDialog = defineAsyncComponent(() => import("./cropperCom.vue"));

// 定义变量内容
const cropperDialogRef = ref();
const state = reactive({
  cropperImg: ""
});
const avatarUp = (e: any) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    state.cropperImg = e.target!.result as string;
  };
  reader.readAsDataURL(file);
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
