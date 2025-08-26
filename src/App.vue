<template>
  <el-config-provider>
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts" name="App">
import {ElConfigProvider} from "element-plus"
</script>
