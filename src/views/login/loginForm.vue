<template>
  <el-button type="primary" @click="handleLogin()">登录</el-button>
</template>

<script setup lang='ts'>
  import { BaseHttpClient } from "@/utils/request";
  import { initControlRoutes } from "@/router/modules/routerController";
  import { useMessage } from "@/hooks/message";
  const router = useRouter();
  const handleLogin = async () => {
    const res = await BaseHttpClient['login']();
    if (res.code === 200) {
      await initControlRoutes();
      useMessage().success("登录成功");
      router.push('/')
    }
  };
</script>

<style></style>