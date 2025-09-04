<template>
  <div class="awesome-container layout-pd">
    <el-card shadow="hover" :header="`svg 图标`">
      <el-row class="iconfont-row">
        <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="2" v-for="(v, k) in state.sheetsIconList" :key="k">
          <div class="iconfont-warp FlexBox s-row-center">
            <div class="m-auto t-center">
              <svg-icon :name="v" :icon-style="iconStyle" class="svg-icon" />
              <div class="iconfont-warp-label mt10">{{ v }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="svg-example">
const iconStyle = { width: "32px", height: "32px" };
// 定义变量内容
const state = reactive({
  sheetsIconList: [] as string[]
});

// 初始化获取 css 样式，这里使用fontawesome的图标(记得加上前缀 `fa`)，其它第三方请自行做判断
const initGetStyleSheets = () => {
  state.sheetsIconList = Object.keys(import.meta.glob("@/assets/icons/*.svg"))
    .map(v => {
      const fileName = v.split("/").pop();
      return fileName ? fileName.replace(".svg", "") : "";
    })
    .filter(name => name !== "");
};
// 页面加载时
onMounted(() => {
  initGetStyleSheets();
});
</script>

<style scoped lang="scss">
$border-color: rgba(74, 136, 245, 0.2);
.awesome-container {
  .iconfont-row {
    border-top: 1px solid $border-color;
    border-left: 1px solid $border-color;
    .iconfont-warp {
      border-right: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
      height: 120px;
      // overflow: hidden;
      transition: all 0.3s ease;
      &:hover {
        box-shadow: 0 2px 24px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
        .iconfont-warp-label {
          color: rgb(74, 136, 245);
          transition: all 0.3s ease;
        }
        .svg-icon {
          fill: rgb(74, 136, 245);
        }
      }
      .iconfont-warp-label {
        color: #fff;
        transition: all 0.3s ease;
      }
      .svg-icon {
        fill: #fff;
        margin: auto;
      }
    }
  }
}
</style>
