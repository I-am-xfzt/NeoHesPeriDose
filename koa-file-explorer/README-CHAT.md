# 智谱AI聊天界面使用指南

## 🎯 功能特点

### 核心功能
- **上下文对话**: AI能记住之前的对话内容，提供连贯回答
- **实时对话**: 基于Vue3 + ElementPlus的现代化聊天界面
- **模型选择**: 支持GLM-4、GLM-3-Turbo、GLM-4V等多种智谱AI模型
- **快捷操作**: 预设常用操作按钮，一键发送指令
- **系统提示**: 可自定义AI助手的行为和回复风格
- **对话管理**: 支持清空对话记录

### 界面特色
- **现代化设计**: 毛玻璃效果 + 渐变背景
- **响应式布局**: 适配不同屏幕尺寸
- **实时状态**: 显示AI服务连接状态
- **流畅动画**: 消息发送和接收的平滑过渡效果

## 🚀 快速开始

### 1. 启动服务
确保AI服务和文件服务器都在运行：

```bash
# 启动文件服务器（端口4000）
npm run dev

# 启动AI服务（端口4001，智谱AI专用）
node handleAI.js
```

### 2. 访问聊天界面
打开浏览器访问：
- **增强版（推荐）**: http://localhost:4000/ai-chat-enhanced.html
- **基础版**: http://localhost:4000/ai-chat-fixed.html

> **推荐使用**: `ai-chat-enhanced.html` - 支持上下文对话，功能更丰富

### 3. 配置API密钥
在`.env`文件中配置智谱AI的API密钥：
```
ZHIPU_API_KEY=your-zhipu-api-key-here
```

## 🎨 界面介绍

### 主界面布局
- **顶部标题栏**: 显示应用名称和连接状态
- **左侧设置面板**: 
  - 模型选择器
  - 快捷操作按钮
  - 系统提示词设置
- **中央聊天区域**:
  - 消息显示区域
  - 输入框和发送按钮

### 消息类型
- **用户消息**: 蓝色气泡，右侧显示
- **AI回复**: 白色气泡，左侧显示，带有机器人头像

## 🔧 使用技巧

### 快捷操作
点击左侧的快捷按钮可以快速发送常用指令：

1. **📁 分析文件夹**: 分析当前目录结构
2. **💻 代码解释**: 请AI解释代码逻辑
3. **📄 内容总结**: 总结文件或文本内容
4. **✨ 代码优化**: 获取代码改进建议

### 模型选择
- **GLM-4**: 最新最强模型，推荐日常使用
- **GLM-3-Turbo**: 速度更快，适合简单任务
- **GLM-4V**: 支持图片分析，可处理视觉任务

### 系统提示词
自定义AI助手的行为方式，例如：
- "你是一个专业的编程助手"
- "请用简洁的语言回答问题"
- "以老师的身份解释概念"

## 📡 API端点

### 聊天接口
- **POST** `/api/ai/chat` - 发送消息（支持上下文）
- **GET** `/api/ai/providers` - 获取可用提供商
- **POST** `/api/ai/set-provider` - 设置AI提供商

### 上下文管理
- **GET** `/api/ai/history` - 获取对话历史
- **POST** `/api/ai/clear-history` - 清空对话历史
- **POST** `/api/ai/set-history-length` - 设置历史长度

### 文件分析
- **POST** `/api/ai/analyze-file` - 分析单个文件（带上下文）
- **POST** `/api/ai/batch-analyze` - 批量分析文件
- **GET** `/api/ai/file-preview` - 获取文件预览

### 请求示例
```bash
# 发送聊天消息（自动包含上下文）
curl -X POST http://localhost:4001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "继续刚才的话题", "options": {"model": "glm-4"}}'

# 获取对话历史
curl http://localhost:4001/api/ai/history

# 清空对话历史
curl -X POST http://localhost:4001/api/ai/clear-history

# 分析文件（包含对话上下文）
curl -X POST http://localhost:4001/api/ai/analyze-file \
  -H "Content-Type: application/json" \
  -d '{"filePath": "path/to/file.txt", "options": {"prompt": "根据我们之前的讨论分析这个文件"}}'
```

## 🛠️ 技术栈

### 前端技术
- **Vue 3**: 渐进式JavaScript框架
- **ElementPlus**: Vue3组件库
- **CSS3**: 现代样式和动画效果

### 后端服务
- **Node.js**: 服务器运行环境
- **Express**: Web服务框架
- **智谱AI API**: AI对话能力

## 🔍 故障排除

### 常见问题

1. **无法连接到服务**
   - 检查AI服务是否启动：`node handleAI.js`
   - 确认端口4001是否被占用
   - 检查API密钥是否正确配置

2. **界面显示异常**
   - 刷新浏览器缓存
   - 检查网络连接
   - 确认ElementPlus资源加载正常

3. **消息发送失败**
   - 检查输入内容是否为空
   - 确认AI服务响应状态
   - 查看浏览器控制台错误信息

### 调试方法
```javascript
// 在浏览器控制台测试API连接
fetch('http://localhost:4001/api/ai/providers')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 📋 文件说明

```
public/
├── ai-chat-simple.html    # 简化版聊天界面（推荐）
├── ai-chat.html          # 完整版聊天界面（含文件上传）
```

## 🎭 扩展功能

### 自定义快捷操作
编辑`ai-chat-simple.html`中的快捷按钮：
```javascript
// 在quick-actions区域添加新的按钮
<div class="quick-action-btn" @click="sendQuickMessage('你的自定义指令')">
    🎯 自定义功能
</div>
```

### 样式定制
聊天界面支持深色模式，可以通过修改CSS变量来自定义主题色。

## 📞 技术支持

如有问题，请检查：
1. 服务状态：`http://localhost:4001/api/ai/providers`
2. 网络连接：确保localhost:4000和localhost:4001可访问
3. API密钥：确认`.env`文件中的ZHIPU_API_KEY有效