<template>
  <div class="chat-ai-container flex-column relative wh100">
    <!-- 头部区域 -->
    <div class="header FlexBox s-row-between relative">
      <div class="header-title FlexBox">
        NeoHesPeriDose AI助手
        <div class="status-indicator" :class="{ 'status-error': !isConnected }"></div>
      </div>
      <div class="FlexBox gap-12">
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleFileChange"
          :before-upload="beforeUpload"
          accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg"
          class="file-upload"
        >
          <el-button :icon="Upload" type="primary">点上传文件进行AI分析</el-button>
        </el-upload>
        <el-select v-model="selectedModel" style="width: 200px">
          <el-option label="GLM-4.5 (推荐)" value="glm-4.5"></el-option>
          <el-option label="GLM-4.5-Air（高性价比）" value="glm-4.5-air"></el-option>
          <el-option label="GLM-3-Turbo" value="glm-3-turbo"></el-option>
          <el-option label="GLM-4.5V (视觉)" value="glm-4.5v"></el-option>
        </el-select>
        <el-button type="text" @click="clearChat" class="clear-btn"> 清空对话 </el-button>
      </div>
    </div>

    <!-- 聊天消息区域 -->
    <div class="chat-area flex-column">
      <el-scrollbar ref="scrollbarRef" style="height: 100%">
        <div class="messages-container flex-column gap-15" ref="messagesContainer">
          <div v-if="messages.length === 0" class="empty-state t-center l-t-center flex-column">
            <div class="logo-core">
              <div class="logo-center">N</div>
            </div>
            <h3>欢迎使用NeoHesPeriDose AI助手</h3>
            <p>输入你的问题开始对话</p>
          </div>

          <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
            <div class="message-avatar l-t-center">
              {{ message.role === "user" ? "👤" : "N" }}
            </div>
            <div class="message-content">
              {{ message.content }}
            </div>
          </div>

          <div v-if="isTyping" class="typing-indicator">
            <div class="typing-avatar">🤖</div>
            <div class="typing-content FlexBox gap-10">
              <div class="typing-text">NeoHesPeriDose AI正在思考中</div>
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 底部输入区域 -->
    <div class="input-area">
      <div class="input-container">
        <div class="input-wrapper">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="2"
            placeholder="输入消息..."
            @keydown.enter.prevent="sendMessage"
            maxlength="2000"
            show-word-limit
            autosize
          />
        </div>
        <el-button @click="sendMessage" :icon="Promotion" :disabled="!inputMessage.trim() || isTyping" type="primary">
          <span v-if="!isTyping">发送消息</span>
          <span v-else>发送中...</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="chatAI">
import { ElMessage, ElMessageBox, ElUpload } from "element-plus";
import { Loading, Promotion, Upload } from "@element-plus/icons-vue";
import { connectionStatus, getChartMsg, getAnalyzeFile } from "@/api/AI";
// 接口定义
interface Message {
  role: "user" | "ai";
  content: string;
}

// 响应式数据
const messages = ref<Message[]>([]);
const inputMessage = ref("");
const isTyping = ref(false);
const isConnected = ref(true);
const selectedModel = ref("glm-4.5");
const systemPrompt = ref("你是NeoHesPeriDose智能助手，是一名专业的AI助手，你无所不能。请用中文回答问题。");
const messagesContainer = ref<HTMLElement>();
const scrollbarRef = ref();

// 文件分析相关状态
const isAnalyzing = ref(false);
const analyzingFileName = ref("");
const uploadRef = ref();

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (scrollbarRef.value) {
      // 使用 el-scrollbar 的 setScrollTop 方法滚动到底部
      const scrollHeight = messagesContainer.value?.scrollHeight || 0;
      scrollbarRef.value.setScrollTop(scrollHeight);
    }
  });
};

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return;

  const userMessage: Message = {
    role: "user",
    content: inputMessage.value
  };

  messages.value.push(userMessage);
  scrollToBottom();

  const originalMessage = inputMessage.value;
  inputMessage.value = "";
  isTyping.value = true;

  try {
    const aiMessage: Message = {
      role: "ai",
      content: await getChartMsg({
        message: originalMessage,
        options: {
          model: selectedModel.value,
          systemPrompt: systemPrompt.value
        }
      })
    };
    messages.value.push(aiMessage);
  } catch (error: any) {
    ElMessage.error("发送失败: " + error.message);
    messages.value.pop();
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
};

// 快捷消息
const sendQuickMessage = (message: string) => {
  inputMessage.value = message;
  sendMessage();
};

// 清空聊天
const clearChat = () => {
  ElMessageBox.confirm("确定要清空所有对话记录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      messages.value = [];
      ElMessage.success("对话已清空");
    })
    .catch(() => {
      // 用户取消操作
    });
};

// 检查连接状态
const checkConnection = async () => {
  try {
    isConnected.value = await connectionStatus();
  } catch (error) {
    isConnected.value = false;
    ElMessage.error("无法连接到NeoHesPeriDose AI服务，请确保服务已启动");
  }
};

// 文件上传处理
const handleFileChange = (file: any) => {
  if (file.raw) {
    analyzeFile(file.raw);
  }
};

// 文件上传前验证
const beforeUpload = (file: File) => {
  // 检查文件大小
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    ElMessage.error("文件大小不能超过50MB");
    return false;
  }

  // 检查文件类型
  const allowedExtensions = [".pdf", ".docx", ".doc", ".txt", ".md", ".png", ".jpg", ".jpeg"];
  const fileName = file.name.toLowerCase();
  const isValidType = allowedExtensions.some(ext => fileName.endsWith(ext));

  if (!isValidType) {
    ElMessage.error("不支持的文件格式！请上传：PDF、Word文档(.docx/.doc)、文本文件(.txt/.md)或图片文件(.png/.jpg/.jpeg)");
    return false;
  }

  return true;
};

// 分析文件
const analyzeFile = async (file: File) => {
  if (isAnalyzing.value || isTyping.value) {
    ElMessage.warning("当前正在处理中，请稍候");
    return;
  }

  isAnalyzing.value = true;
  analyzingFileName.value = file.name;

  try {
    // 添加用户消息显示上传的文件
    const userMessage: Message = {
      role: "user",
      content: `📎 上传文件：${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`
    };
    messages.value.push(userMessage);
    scrollToBottom();

    // 添加AI思考状态
    isTyping.value = true;

    // 调用文件分析API
    const result = await getAnalyzeFile(file);

    // 处理分析结果
    let analysisContent = "文件分析完成！\n\n";

    if (result.success) {
      analysisContent += result.content || "文件分析成功，但没有返回具体内容。";
    } else {
      analysisContent += `分析过程中出现错误：${result.error || "未知错误"}`;
    }

    // 添加AI回复消息
    const aiMessage: Message = {
      role: "ai",
      content: analysisContent
    };
    messages.value.push(aiMessage);

    ElMessage.success("文件分析完成");
  } catch (error: any) {
    ElMessage.error("文件分析失败: " + error.message);

    // 添加错误消息
    const errorMessage: Message = {
      role: "ai",
      content: `文件分析失败：${error.message}。请检查文件格式是否支持，或稍后重试。`
    };
    messages.value.push(errorMessage);
  } finally {
    isAnalyzing.value = false;
    analyzingFileName.value = "";
    isTyping.value = false;
    scrollToBottom();

    // 清空上传组件
    if (uploadRef.value) {
      uploadRef.value.clearFiles();
    }
  }
};

// 组件挂载
onMounted(() => {
  checkConnection();

  messages.value.push({
    role: "ai",
    content:
      "你好！我是NeoHesPeriDose AI助手，我可以帮您分析代码、处理文件、解答技术问题，以及协助系统维护工作。请直接输入消息开始对线，我无所不能哦！"
  });
});
</script>

<style scoped lang="scss">
.chat-ai-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow: hidden;

  // 添加动态粒子背景效果
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle at 20% 20%, rgba(64, 160, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(103, 194, 58, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
    animation: backgroundShift 20s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  .header {
    border-bottom: 1px solid rgba(64, 160, 255, 0.2);
    padding: 20px 30px;
    z-index: 10;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

    // 添加流动边框效果
    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(64, 160, 255, 0.6) 20%,
        rgba(103, 194, 58, 0.6) 80%,
        transparent 100%
      );
      animation: borderFlow 3s ease-in-out infinite;
    }

    .header-title {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      gap: 15px;
      text-shadow: 0 2px 10px rgba(64, 160, 255, 0.3);

      span {
        font-size: 28px;
        animation: iconGlow 2s ease-in-out infinite alternate;
      }
    }

    .status-indicator {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: radial-gradient(circle, #67c23a, #5daf34);
      animation: statusPulse 2s infinite;
      box-shadow: 0 0 15px rgba(103, 194, 58, 0.6);

      &.status-error {
        background: radial-gradient(circle, #f56c6c, #e6393a);
        box-shadow: 0 0 15px rgba(245, 108, 108, 0.6);
      }
    }

    .el-button {
      background: rgba(64, 160, 255, 0.15);
      border: 1px solid rgba(64, 160, 255, 0.3);
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: 500;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);

      &:hover {
        background: rgba(64, 160, 255, 0.25);
        border-color: rgba(64, 160, 255, 0.5);
        box-shadow: 0 5px 20px rgba(64, 160, 255, 0.3);
        transform: translateY(-2px);
      }
    }
  }

  .chat-area {
    height: calc(100% - 198px);
  }

  .messages-container {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }

  .empty-state {
    height: 100%;
    color: rgba(255, 255, 255, 0.7);

    .empty-state-icon {
      font-size: 64px;
      margin-bottom: 20px;
      opacity: 0.5;
    }
  }

  .message {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    opacity: 1;
    transform: translateY(0) scale(1);
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    animation: messageAppear 0.8s ease-out;

    // 进入动画 - 渐隐渐显效果
    &.message-entering {
      opacity: 0;
      transform: translateY(20px) scale(0.9);
    }

    &.user {
      flex-direction: row-reverse;

      &.message-entering {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
      }
    }

    &.ai.message-entering {
      opacity: 0;
      transform: translateY(20px) scale(0.9);
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 20px;
      flex-shrink: 0;
    }

    &.user .message-avatar {
      background: #409eff;
      color: white;
    }

    &.ai .message-avatar {
      background: radial-gradient(circle, #4fc3f7, #29b6f6, #0288d1);
      box-shadow: 0 0 20px rgba(79, 195, 247, 0.6);
      color: white;
    }

    .message-content {
      max-width: 70%;
      padding: 16px 20px;
      border-radius: 20px;
      word-wrap: break-word;
      line-height: 1.6;
      white-space: pre-wrap;
      position: relative;
    }

    &.user .message-content {
      background: linear-gradient(135deg, rgba(64, 160, 255, 0.2), rgba(64, 160, 255, 0.15));
      color: #ffffff;
      border-bottom-right-radius: 8px;
      box-shadow: 0 5px 20px rgba(64, 160, 255, 0.2);
    }

    &.ai .message-content {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08));
      color: #ffffff;
      border-bottom-left-radius: 8px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    }
  }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;

    .typing-dots {
      display: flex;
      gap: 4px;

      span {
        width: 6px;
        height: 6px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        animation: typingBounce 1.4s infinite;

        &:nth-child(2) {
          animation-delay: 0.2s;
        }

        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }
  }

  .input-area {
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    .input-container {
      display: flex;
      gap: 10px;
      align-items: flex-end;
    }

    .input-wrapper {
      flex: 1;
      position: relative;
      :deep(.el-textarea__inner) {
        min-height: 33px !important;
      }
    }
  }
}

// 动画定义
@keyframes uploadIconPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes backgroundShift {
  0%,
  100% {
    opacity: 1;
    transform: translateX(0);
  }
  50% {
    opacity: 0.8;
    transform: translateX(10px);
  }
}

@keyframes borderFlow {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes iconGlow {
  0% {
    text-shadow: 0 0 10px rgba(64, 160, 255, 0.3);
  }
  100% {
    text-shadow: 0 0 20px rgba(64, 160, 255, 0.6), 0 0 30px rgba(103, 194, 58, 0.3);
  }
}

@keyframes statusPulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

@keyframes messageAppear {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes typingBounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-12px);
  }
}
</style>
