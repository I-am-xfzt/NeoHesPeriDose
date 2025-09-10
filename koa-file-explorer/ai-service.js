// @ts-nocheck
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class AIService {
  constructor() {
    // 仅支持智谱AI
    this.providers = {
      zhipu: {
        baseURL: 'https://open.bigmodel.cn/api/paas/v4',
        apiKey: process.env.ZHIPU_API_KEY
      }
    };
    this.currentProvider = 'zhipu'; // 默认提供商
    this.conversationHistory = []; // 存储对话历史
    this.maxHistoryLength = 10; // 最大历史记录条数
  }

  // 设置当前使用的AI提供商
  setProvider(provider) {
    if (this.providers[provider]) {
      this.currentProvider = provider;
      return true;
    }
    return false;
  }

  // 添加对话历史记录
  addToHistory(role, content) {
    this.conversationHistory.push({ role, content });
    
    // 限制历史记录长度
    if (this.conversationHistory.length > this.maxHistoryLength * 2) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2);
    }
  }

  // 清空对话历史
  clearHistory() {
    this.conversationHistory = [];
  }

  // 获取对话历史
  getHistory() {
    return [...this.conversationHistory];
  }

  // 设置最大历史记录长度
  setMaxHistoryLength(length) {
    this.maxHistoryLength = Math.max(1, Math.min(50, length));
    
    // 如果当前历史超过新限制，进行裁剪
    if (this.conversationHistory.length > this.maxHistoryLength * 2) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2);
    }
  }

  // 获取可用的提供商列表
  getAvailableProviders() {
    return Object.keys(this.providers).filter(provider => 
      this.providers[provider].apiKey
    );
  }

  // 通用聊天接口（支持上下文）
  async chat(message, options = {}) {
    try {
      const provider = this.providers[this.currentProvider];
      if (!provider.apiKey) {
        throw new Error(`${this.currentProvider} API密钥未配置`);
      }

      // 添加用户消息到历史记录
      this.addToHistory('user', message);

      // 构建消息数组，包含系统提示和历史记录
      const messages = [
        { role: 'system', content: options.systemPrompt || '你是一个有用的AI助手，请根据对话上下文提供连贯的回答。' }
      ];

      // 添加历史对话（限制长度）
      const recentHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2);
      messages.push(...recentHistory);

      const response = await axios.post(
        `${provider.baseURL}/chat/completions`,
        {
          model: options.model || this.getDefaultModel(),
          messages: messages,
          max_tokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.7,
          stream: options.stream || false,
          top_p: options.topP || 0.9,
          presence_penalty: options.presencePenalty || 0.1,
          frequency_penalty: options.frequencyPenalty || 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      
      // 添加AI回复到历史记录
      this.addToHistory('assistant', aiResponse);

      return {
        success: true,
        content: aiResponse,
        usage: response.data.usage,
        model: response.data.model,
        historyLength: this.conversationHistory.length / 2 // 返回对话轮数
      };
    } catch (error) {
      console.error('AI聊天错误:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // 文件内容分析
  async analyzeFile(filePath, options = {}) {
    try {
      const stats = fs.statSync(filePath);
      
      if (stats.size > 10 * 1024 * 1024) { // 10MB限制
        return {
          success: false,
          error: '文件过大，无法分析'
        };
      }

      const ext = path.extname(filePath).toLowerCase();
      let content = '';
      let fileType = '';

      // 根据文件类型处理
      if (['.txt', '.md', '.json', '.js', '.py', '.html', '.css'].includes(ext)) {
        content = fs.readFileSync(filePath, 'utf-8');
        fileType = 'text';
      } else if (['.png', '.jpg', '.jpeg', '.gif', '.bmp'].includes(ext)) {
        // 图片文件使用base64编码
        const imageBuffer = fs.readFileSync(filePath);
        content = imageBuffer.toString('base64');
        fileType = 'image';
      } else {
        return {
          success: false,
          error: '不支持的文件类型'
        };
      }

      let prompt = options.prompt || '';
      if (fileType === 'text') {
        prompt = prompt || `请分析以下文件内容：\n\n${content}`;
        return await this.chat(prompt, options);
      } else if (fileType === 'image') {
        return await this.analyzeImage(content, filePath, options);
      }

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 图片分析（支持上下文）
  async analyzeImage(base64Image, filePath, options = {}) {
    try {
      const provider = this.providers[this.currentProvider];
      if (!provider.apiKey) {
        throw new Error(`${this.currentProvider} API密钥未配置`);
      }

      const prompt = options.prompt || '请详细描述这张图片的内容，包括场景、物体、颜色、风格等细节。';

      // 添加用户图片分析请求到历史记录
      this.addToHistory('user', `[图片分析请求] ${prompt}`);

      // 构建消息数组
      const messages = [
        { role: 'system', content: options.systemPrompt || '你是一个有用的AI助手，能够分析图片内容并结合对话上下文提供详细描述。' }
      ];

      // 添加历史对话
      const recentHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2);
      messages.push(...recentHistory);

      // 添加当前图片分析消息
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
              detail: 'high'
            }
          }
        ]
      });

      const response = await axios.post(
        `${provider.baseURL}/chat/completions`,
        {
          model: options.model || 'glm-4.5v',
          messages: messages,
          max_tokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.7,
          top_p: 0.9,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      
      // 添加AI回复到历史记录
      this.addToHistory('assistant', aiResponse);

      return {
        success: true,
        content: aiResponse,
        usage: response.data.usage,
        model: response.data.model,
        historyLength: this.conversationHistory.length / 2
      };
    } catch (error) {
      console.error('图片分析错误:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // 获取默认模型
  getDefaultModel() {
    const defaults = {
      zhipu: 'glm-4'
    };
    return defaults[this.currentProvider] || 'glm-4';
  }

  // 获取支持的模型列表
  getSupportedModels() {
    return {
      zhipu: [
        'glm-4',           // 通用对话模型
        'glm-4v',          // 视觉理解模型
        'glm-4-vision',    // 视觉理解模型（别名）
        'glm-4.5v',        // 最新视觉理解模型
        'glm-3-turbo',     // 轻量级模型
        'glm-4-flash',     // 快速响应模型
        'cogview-3',       // 图像生成模型
        'cogvideox',       // 视频理解模型
      ]
    };
  }

  // 批量处理多个文件
  async batchAnalyze(filePaths, options = {}) {
    const results = [];
    
    for (const filePath of filePaths) {
      const result = await this.analyzeFile(filePath, options);
      results.push({
        file: filePath,
        ...result
      });
    }

    return results;
  }
}

module.exports = AIService;