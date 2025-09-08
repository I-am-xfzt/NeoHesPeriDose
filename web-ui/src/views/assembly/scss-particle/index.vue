<script setup lang="ts">
import { createParticle } from "./createParticle";
const sk = ref<HTMLElement | null>();
</script>

<template>
  <div class="page-container relative" ref="sk">
    <el-card style="position: relative;z-index: 1" shadow="hover" header="scss粒子✨🌟">
      <el-alert title="`使用scss代码实现粒子效果`" type="primary" :closable="false" class="mb15"></el-alert>
      <div class="t-center">
        <el-button @click="createParticle(sk)" type="primary">点击开始</el-button>
      </div>
    </el-card>
  </div>
</template>
