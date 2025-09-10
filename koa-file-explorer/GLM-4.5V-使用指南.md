# GLM-4.5V 图片分析使用指南

## 简介

GLM-4.5V 是智谱AI最新推出的视觉理解模型，具备强大的图片理解和分析能力。相比GLM-4V，GLM-4.5V在以下方面有显著提升：

- **更强的视觉理解**：能识别更复杂的场景和细节
- **更高的准确率**：减少误判和幻觉
- **更好的中文理解**：针对中文语境优化
- **支持多轮对话**：结合上下文提供更准确的分析

## 支持的图片格式

- **图片格式**：JPG、JPEG、PNG、GIF、BMP、WebP
- **文件大小**：单张图片最大10MB
- **分辨率**：支持各种分辨率，建议不超过4096x4096

## 使用方法

### 1. 通过增强版聊天界面

1. **启动服务**
   ```bash
   node handleAI.js
   ```

2. **访问界面**
   打开浏览器访问：`http://localhost:3000/ai-chat-enhanced.html`

3. **选择模型**
   在界面顶部选择 `GLM-4.5V (推荐)`

4. **上传图片**
   - 拖拽图片到聊天窗口
   - 或点击上传按钮选择图片

5. **提问**
   在输入框中输入你的问题，例如：
   - "这张图片里有什么？"
   - "请详细描述这个场景"
   - "这个图表说明了什么？"
   - "帮我识别图片中的文字"

### 2. 通过API调用

#### 基础图片分析

```bash
curl -X POST http://localhost:3000/api/ai/analyze-image \
  -H "Content-Type: application/json" \
  -d '{
    "imagePath": "path/to/your/image.jpg",
    "prompt": "请详细分析这张图片",
    "model": "glm-4.5v"
  }'
```

#### 带上下文的图片分析

```bash
curl -X POST http://localhost:3000/api/ai/analyze-image \
  -H "Content-Type: application/json" \
  -d '{
    "imagePath": "path/to/your/image.jpg",
    "prompt": "结合之前的对话，这张图片有什么新发现？",
    "model": "glm-4.5v",
    "useContext": true
  }'
```

### 3. 通过JavaScript代码

```javascript
const axios = require('axios');

async function analyzeImageWithGLM45V(imagePath, question) {
  try {
    const response = await axios.post('http://localhost:3000/api/ai/analyze-image', {
      imagePath: imagePath,
      prompt: question,
      model: 'glm-4.5v',
      maxTokens: 2000,
      temperature: 0.7
    });
    
    console.log('分析结果:', response.data.data.analysis);
    console.log('使用模型:', response.data.data.model);
    console.log('对话轮数:', response.data.data.historyLength);
  } catch (error) {
    console.error('分析失败:', error.message);
  }
}

// 使用示例
analyzeImageWithGLM45V('./test.jpg', '请详细描述这张图片的内容');
```

## 高级功能

### 1. 批量图片分析

```bash
curl -X POST http://localhost:3000/api/ai/batch-analyze \
  -H "Content-Type: application/json" \
  -d '{
    "files": ["image1.jpg", "image2.png", "image3.gif"],
    "model": "glm-4.5v",
    "prompt": "请分析这些图片的共同点"
  }'
```

### 2. 上下文记忆功能

GLM-4.5V支持对话上下文记忆，可以在多轮对话中保持连贯性：

```bash
# 第一轮
curl -X POST http://localhost:3000/api/ai/analyze-image \
  -d '{"imagePath": "scene.jpg", "prompt": "这是什么场景？"}'

# 第二轮（基于上下文）
curl -X POST http://localhost:3000/api/ai/chat \
  -d '{"message": "这个场景有什么特别之处？"}'
```

### 3. 参数调优

```javascript
const options = {
  model: 'glm-4.5v',
  maxTokens: 2000,        // 最大输出长度
  temperature: 0.7,       // 创造性程度 (0.0-1.0)
  top_p: 0.9,            // 采样阈值
  presence_penalty: 0.1,  // 主题重复惩罚
  frequency_penalty: 0.1   // 词语重复惩罚
};
```

## 实用示例

### 示例1：OCR文字识别

```bash
curl -X POST http://localhost:3000/api/ai/analyze-image \
  -d '{
    "imagePath": "document.jpg",
    "prompt": "请识别图片中的所有文字，保持原有格式"
  }'
```

### 示例2：图表分析

```bash
curl -X POST http://localhost:3000/api/ai/analyze-image \
  -d '{
    "imagePath": "chart.png",
    "prompt": "请分析这个图表的数据和趋势，给出详细解读"
  }'
```

### 示例3：场景描述

```bash
curl -X POST http://localhost:3000/api/ai/analyze-image \
  -d '{
    "imagePath": "landscape.jpg",
    "prompt": "请用优美的语言描述这个风景，包括时间、地点、氛围等细节"
  }'
```

### 示例4：商品识别

```bash
curl -X POST http://localhost:3000/api/ai/analyze-image \
  -d '{
    "imagePath": "product.jpg",
    "prompt": "请识别这是什么商品，包括品牌、型号、主要特征等信息"
  }'
```

## 错误处理

### 常见错误及解决方案

1. **图片太大**
   ```
   错误：图片文件超过10MB限制
   解决：压缩图片或使用更小的图片
   ```

2. **格式不支持**
   ```
   错误：不支持的图片格式
   解决：转换为JPG、PNG等常见格式
   ```

3. **网络超时**
   ```
   错误：请求超时
   解决：检查网络连接，增加timeout参数
   ```

4. **API密钥错误**
   ```
   错误：401 Unauthorized
   解决：检查config.json中的智谱AI API密钥
   ```

## 性能优化建议

1. **图片预处理**
   - 压缩大图片到合适尺寸
   - 转换为JPG格式减小文件大小
   - 去除不必要的元数据

2. **缓存策略**
   - 对重复图片使用缓存
   - 保存分析结果避免重复调用

3. **并发控制**
   - 批量分析时控制并发数量
   - 使用队列管理大量请求

## 测试图片

可以使用以下测试图片验证功能：

1. **文字图片**：包含清晰文字的图片
2. **风景图片**：包含丰富场景的图片
3. **商品图片**：包含具体物品的图片
4. **图表图片**：包含数据可视化的图片

## 获取帮助

- **查看日志**：检查控制台输出
- **测试连接**：访问 `http://localhost:3000/api/ai/providers`
- **查看文档**：参考README-CHAT.md
- **调试工具**：使用增强版聊天界面进行测试