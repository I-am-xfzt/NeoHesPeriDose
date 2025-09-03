<script setup lang="ts">
const Login = defineAsyncComponent(() => import('@/views/login/loginForm.vue'));
</script>

<template>
  <div class="wh100 Login">
    <!-- <div class="Login-bg"></div> -->
    <Login />
  </div>
</template>

<style scoped lang="scss">
  .Login {
    background-color: rgb(14, 18, 21);
    &-bg{
      height: 100vh;
      width: 50vw;
      background: url('@/assets/images/loginLogo.png') no-repeat;
      background-size: cover;
    }
  }
</style>