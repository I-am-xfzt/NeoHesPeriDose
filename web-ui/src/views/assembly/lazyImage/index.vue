<template>
  <div class="page-container wh100">
    <el-card class="wh100">
      <template #header> 图片懒加载演示 </template>
      <el-alert
        title="使用 IntersectionObserver API 判断元素是否进入或离开视口来进行加载图片，还可根据情况优化大量网络请求 "
        type="primary"
        :closable="false"
        class="mb15"
      ></el-alert>
      <!-- 图片懒加载列表 -->
      <div class="image-grid mt20">
        <el-scrollbar>
          <div v-for="index in 30" :key="index" class="image-item rounded-8">
            <div class="image-container relative">
              <!-- 懒加载图片 -->
              <img
                class="lazy-image"
                :data-img="`https://picsum.photos/800/600?random=${index}`"
                :data-key="index - 1"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3E加载中...%3C/text%3E%3C/svg%3E"
                alt="懒加载图片"
              />
              <!-- 加载状态 -->
              <div v-if="loadingStates[index - 1]" class="loading-overlay absolute posZero wh100 flx-center flex-column">
                <div class="loading-spinner"></div>
                <span class="loading-text">加载中...</span>
              </div>
            </div>
            <div class="image-info pt16 pr16 pb16 pl16">
              <p class="image-title mb8">随机图片 {{ index }}</p>
              <p class="image-description">这是第 {{ index }} 张演示懒加载效果的图片</p>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="lazyImage">
import { ref, onMounted } from "vue";
import { lazyImg } from "@/utils/other";

/**
 * 加载状态数组，用于跟踪每张图片的加载状态
 */
const loadingStates = ref<boolean[]>(Array(30).fill(true));

/**
 * 组件挂载后初始化懒加载
 */
onMounted(async () => {
  // 使用 utils/other.ts 中的 lazyImg 函数
  await lazyImg(".lazy-image", loadingStates.value);
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
