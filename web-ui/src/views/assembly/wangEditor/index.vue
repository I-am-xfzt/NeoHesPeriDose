<template>
  <div class="card content-box">
    <el-card shadow="hover" header="富文本编辑器 🍓🍇🍈🍉">
      <div class="flex-column FlexBox gap-12">
        <WangEditor v-model:value="content" height="400px" />
      <el-button type="primary" style="margin: auto;" @click="dialogVisible = true"> 内容预览 </el-button>
      </div>
    </el-card>
    <theDialog v-model="dialogVisible" title="富文本内容预览" width="1300px" top="50px">
      <div class="view" v-html="content"></div>
    </theDialog>
  </div>
</template>

<script setup lang="ts" name="wangEditor">
import theDialog from "@/components/Dialog/index.vue";
import WangEditor from "@/components/WangEditor/index.vue";

const content = ref("");

const dialogVisible = ref(false);
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
