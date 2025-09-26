<template>
  <div class="login-form">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large" @keyup.enter="handleLogin">
      <!-- 用户名输入框 -->
      <el-form-item prop="username">
        <div class="input-wrapper">
          <div class="input-icon">
            <el-icon><User /></el-icon>
          </div>
          <el-input v-model="loginForm.username" placeholder="请输入用户名" class="login-input" clearable />
        </div>
      </el-form-item>

      <!-- 密码输入框 -->
      <el-form-item prop="password">
        <div class="input-wrapper">
          <div class="input-icon">
            <el-icon><Lock /></el-icon>
          </div>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            class="login-input"
            show-password
            clearable
          />
        </div>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-form-item>
        <div class="login-button hand" @click.stop="handleLogin">
          <div class="button-content">
            <span v-if="!loading" class="button-text">登录</span>
            <span v-else class="button-text">登录中...</span>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from "@element-plus/icons-vue";
import { BaseHttpClient } from "@/utils/request";
import { initControlRoutes } from "@/router/modules/routerController";
import { useMessage } from "@/hooks/message";
import { NextLoading } from "@/utils/loading";
import { Session } from "@/utils/storage";
const router = useRouter();
const { success, error } = useMessage();

// 表单引用
const loginFormRef = ref();

// 加载状态
const loading = ref(false);

// 表单数据
const loginForm = reactive({
  username: "admin",
  password: "123456"
});

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 20, message: "用户名长度为2-20个字符", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度为6-20个字符", trigger: "blur" }
  ]
};

// 登录函数
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    // 表单验证
    await loginFormRef.value.validate();
    loading.value = true;
    // 调用登录接口
    const res = await BaseHttpClient["login"](loginForm);
    Session.set("token", res.data);
    if (res.code === 200) {
      // 初始化路由权限
      const isNormal = await initControlRoutes();
      if (isNormal) {
        // 跳转到首页
        await router.push("/");
        // 显示成功消息
        success("登录成功！");
      }
    } else {
      error("登录失败，请检查用户名和密码");
    }
  } catch (err) {
    console.error("登录错误:", err);
    error("登录失败，请稍后再试");
  } finally {
    loading.value = false;
    NextLoading.done();
  }
};

// 组件挂载时的动画效果
onMounted(() => {
  // 添加进入动画
  nextTick(() => {
    const form = document.querySelector(".login-form");
    if (form) {
      form.classList.add("animate-in");
    }
  });
});
</script>

<style scoped lang="scss">
@use "./loginForm.scss";
</style>
