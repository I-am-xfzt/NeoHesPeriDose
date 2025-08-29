<script setup lang="ts">
const Login = defineAsyncComponent(() => import('@/views/login/loginForm.vue'));
</script>

<template>
  <div class="wh100">
    <Login />
  </div>
</template>

<style scoped lang="scss"></style>