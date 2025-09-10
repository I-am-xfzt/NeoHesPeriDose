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
        <button class="login-button" size="large" @click="handleLogin">
          <div class="button-content">
            <span v-if="!loading" class="button-text">登录</span>
            <span v-else class="button-text">登录中...</span>
          </div>
        </button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from "@element-plus/icons-vue";
import { BaseHttpClient } from "@/utils/request";
import { initControlRoutes } from "@/router/modules/routerController";
import { useMessage } from "@/hooks/message";
import { NextLoading } from "@/utils/loading"
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

    if (res.code === 200) {
      // 初始化路由权限
      await initControlRoutes();
      // 显示成功消息
      success("登录成功！");
      // 跳转到首页
      router.push("/");
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
.login-form {
  width: 100%;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;

  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
}

// 表单项样式
:deep(.el-form-item) {
  margin-bottom: 28px;

  .el-form-item__content {
    line-height: normal;
  }

  .el-form-item__error {
    color: #ff6b6b;
    font-size: 12px;
    padding-top: 4px;
  }
}

// 输入框容器
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 320px;
  background: rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(79, 195, 247, 0.2);
  border-radius: 15px;
  transition: all 0.4s ease;
  overflow: hidden;
  backdrop-filter: blur(10px);
  margin: 0 auto;

  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #4fc3f7, #00ffff, #4fc3f7, #00ffff);
    background-size: 300% 300%;
    border-radius: 15px;
    opacity: 0;
    z-index: -1;
    animation: borderFlow 4s ease-in-out infinite;
  }

  &:hover {
    border-color: rgba(79, 195, 247, 0.4);
    background: rgba(0, 0, 0, 0.25);
    box-shadow: 0 0 20px rgba(79, 195, 247, 0.15), inset 0 0 15px rgba(79, 195, 247, 0.05);
    transform: translateY(-2px);

    &::before {
      opacity: 0.3;
    }
  }

  &:focus-within {
    border-color: #4fc3f7;
    background: rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 25px rgba(79, 195, 247, 0.25), inset 0 0 20px rgba(79, 195, 247, 0.08);
    transform: translateY(-3px);

    &::before {
      opacity: 0.5;
    }
  }
}

@keyframes borderFlow {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

// 输入框图标
.input-icon {
  padding: 0 18px;
  color: rgba(79, 195, 247, 0.7);
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(79, 195, 247, 0.2), transparent);
    opacity: 0;
    transition: all 0.3s ease;
  }

  .input-wrapper:focus-within & {
    color: #4fc3f7;
    text-shadow: 0 0 10px rgba(79, 195, 247, 0.8);

    &::after {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.5);
    }
  }

  .input-wrapper:hover & {
    color: rgba(79, 195, 247, 0.9);
  }
}

// 输入框样式
:deep(.login-input) {
  .el-input__wrapper {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 16px 15px 16px 0;

    .el-input__inner {
      color: #ffffff;
      background: transparent;
      border: none;
      font-size: 16px;
      height: auto;
      line-height: 1.5;

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }

    .el-input__suffix {
      .el-input__suffix-inner {
        .el-icon {
          color: rgba(255, 255, 255, 0.6);

          &:hover {
            color: #4fc3f7;
          }
        }
      }
    }
  }

  &.is-focus .el-input__wrapper {
    box-shadow: none;
  }
}

// 登录按钮
.login-button {
  width: 320px;
  height: 60px;
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 50%, #0288d1 100%);
  border: none;
  border-radius: 15px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  display: block;
  box-shadow: 0 8px 25px rgba(79, 195, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  color: #fff;
  .button-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .button-glow {
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #4fc3f7, #00ffff, #4fc3f7);
    border-radius: 15px;
    opacity: 0;
    z-index: 1;
    animation: buttonGlow 3s ease-in-out infinite;
  }

  .button-text {
    position: relative;
    z-index: 3;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .button-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: particleMove 2s ease-in-out infinite;
  }

  .particle:nth-child(1) {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  .particle:nth-child(2) {
    top: 60%;
    left: 20%;
    animation-delay: 0.3s;
  }

  .particle:nth-child(3) {
    top: 30%;
    right: 15%;
    animation-delay: 0.6s;
  }

  .particle:nth-child(4) {
    bottom: 25%;
    right: 25%;
    animation-delay: 0.9s;
  }

  .particle:nth-child(5) {
    top: 50%;
    left: 50%;
    animation-delay: 1.2s;
  }

  .particle:nth-child(6) {
    bottom: 20%;
    left: 30%;
    animation-delay: 1.5s;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.8s ease;
    z-index: 2;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(79, 195, 247, 0.5), 0 5px 15px rgba(79, 195, 247, 0.3);

    .button-glow {
      opacity: 1;
    }

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }

  &.is-loading {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    cursor: not-allowed;

    &:hover {
      transform: none;
      box-shadow: 0 8px 25px rgba(79, 195, 247, 0.3);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .input-wrapper {
    width: 100%;
    max-width: 300px;
  }

  :deep(.login-button) {
    width: 100%;
    max-width: 300px;
    height: 55px;
    font-size: 16px;
  }

  .input-icon {
    padding: 0 15px;
  }

  :deep(.login-input) {
    .el-input__wrapper {
      padding: 14px 12px 14px 0;
    }
  }
}

@media (max-width: 480px) {
  .input-wrapper {
    width: 100%;
    max-width: 280px;
  }

  :deep(.login-button) {
    width: 100%;
    max-width: 280px;
    height: 50px;
    font-size: 15px;
  }

  .input-icon {
    padding: 0 12px;
  }

  :deep(.login-input) {
    .el-input__wrapper {
      padding: 12px 10px 12px 0;

      .el-input__inner {
        font-size: 15px;
      }
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 24px;
  }
}

@media (max-width: 360px) {
  .input-wrapper {
    width: 100%;
    max-width: 260px;
  }

  :deep(.login-button) {
    width: 100%;
    max-width: 260px;
    height: 48px;
    font-size: 14px;
  }

  .input-icon {
    padding: 0 10px;
  }

  :deep(.login-input) {
    .el-input__wrapper {
      padding: 10px 8px 10px 0;

      .el-input__inner {
        font-size: 14px;
      }
    }
  }
}
</style>
