# Node.js AI 接入指南

## 功能概述

本项目集成了 AI 功能到现有的文件服务器中，支持多种 AI 提供商，包括文件分析和智能对话。

## 支持的AI提供商

- **智谱AI** (GLM系列) - 唯一支持的提供商

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置API密钥

复制环境变量文件并填写你的智谱AI API密钥：

```bash
cp .env.example .env
```

编辑 `.env` 文件：
```
ZHIPU_API_KEY=your-zhipu-key-here
```

### 3. 启动服务

#### 文件服务器 (端口4000)
```bash
npm run dev
```

#### AI服务 (端口4001)
```bash
node handleAI.js
```

## API接口文档

### 获取AI提供商列表
```http
GET http://localhost:4001/api/ai/providers
```

### 设置AI提供商
```http
POST http://localhost:4001/api/ai/set-provider
Content-Type: application/json

{
  "provider": "openai"
}
```

### AI聊天
```http
POST http://localhost:4001/api/ai/chat
Content-Type: application/json

{
  "message": "你好，请介绍一下自己",
  "options": {
    "systemPrompt": "你是一个专业的AI助手",
    "maxTokens": 1000
  }
}
```

### 分析单个文件
```http
POST http://localhost:4001/api/ai/analyze-file
Content-Type: application/json

{
  "filePath": "worksCode/your-file.txt",
  "options": {
    "prompt": "请分析这个文件的内容"
  }
}
```

### 批量分析文件
```http
POST http://localhost:4001/api/ai/batch-analyze
Content-Type: application/json

{
  "filePaths": [
    "worksCode/file1.txt",
    "worksCode/file2.jpg"
  ],
  "options": {
    "prompt": "请分析这些文件"
  }
}
```

### 文件预览
```http
GET http://localhost:4001/api/ai/file-preview?path=worksCode/your-file.txt
```

## 支持的文件类型

### 文本文件
- `.txt`, `.md`, `.json`
- `.js`, `.py`, `.html`, `.css`
- `.xml`, `.csv`

### 图片文件
- `.png`, `.jpg`, `.jpeg`
- `.gif`, `.bmp`

### 限制
- 文本文件最大100KB
- 图片文件最大10MB

## 使用示例

### 1. 基本聊天
```javascript
const axios = require('axios');

async function basicChat() {
  const response = await axios.post('http://localhost:4001/api/ai/chat', {
    message: "请用中文介绍一下Node.js"
  });
  console.log(response.data.content);
}
```

### 2. 分析代码文件
```javascript
async function analyzeCode() {
  const response = await axios.post('http://localhost:4001/api/ai/analyze-file', {
    filePath: "worksCode/project/server.js",
    options: {
      prompt: "请分析这段代码的功能和结构"
    }
  });
  console.log(response.data.content);
}
```

### 3. 分析图片
```javascript
async function analyzeImage() {
  const response = await axios.post('http://localhost:4001/api/ai/analyze-file', {
    filePath: "worksCode/images/screenshot.png",
    options: {
      prompt: "请描述这张图片的内容"
    }
  });
  console.log(response.data.content);
}
```

## 前端集成示例

### HTML页面集成
```html
<!DOCTYPE html>
<html>
<head>
    <title>AI文件分析器</title>
</head>
<body>
    <div id="app">
        <h1>AI文件分析</h1>
        <div>
            <input type="file" id="fileInput" webkitdirectory directory>
            <button onclick="analyzeFiles()">分析选中文件</button>
        </div>
        <div id="result"></div>
    </div>

    <script>
        async function analyzeFiles() {
            const files = Array.from(document.getElementById('fileInput').files);
            const filePaths = files.map(f => f.webkitRelativePath);
            
            const response = await fetch('http://localhost:4001/api/ai/batch-analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filePaths,
                    options: { prompt: "请分析这些文件" }
                })
            });
            
            const result = await response.json();
            document.getElementById('result').innerHTML = 
                result.data.map(r => `<div><h3>${r.file}</h3><p>${r.content}</p></div>`).join('');
        }
    </script>
</body>
</html>
```

## 故障排除

### 常见问题

1. **API密钥无效**
   - 检查 `.env` 文件中的密钥是否正确
   - 确保密钥有对应的API权限

2. **文件路径错误**
   - 使用相对于D盘的路径
   - 确保文件存在且有读取权限

3. **端口冲突**
   - 修改 `.env` 文件中的 `AI_PORT`
   - 或使用环境变量 `AI_PORT=4002 node handleAI.js`

### 调试模式

启动时添加调试信息：
```bash
DEBUG=1 node handleAI.js
```

## 扩展功能

你可以通过修改 `ai-service.js` 来添加更多AI提供商或功能：

1. 在 `providers` 对象中添加新的提供商配置
2. 实现新的分析方法
3. 添加文件类型支持

## 安全提示

- 不要在代码中硬编码API密钥
- 在生产环境中使用HTTPS
- 限制API访问频率
- 定期轮换API密钥