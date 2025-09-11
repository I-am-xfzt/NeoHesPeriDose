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

  // 统一的axios请求封装
  async makeRequest(endpoint, data, options = {}) {
    try {
      const provider = this.providers[this.currentProvider];
      if (!provider.apiKey) {
        throw new Error(`${this.currentProvider} API密钥未配置`);
      }

      const config = {
        method: options.method || 'POST',
        url: `${provider.baseURL}${endpoint}`,
        data: data,
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`,
          ...options.headers
        },
        timeout: options.timeout || 0, // 0表示无超时限制
        ...options.axiosConfig
      };

      // 如果不是multipart/form-data，则设置Content-Type
      if (!options.headers || !options.headers['content-type']) {
        config.headers['Content-Type'] = 'application/json';
      }

      // 打印请求参数（隐藏敏感信息）
      const logConfig = {
        method: config.method,
        url: config.url,
        headers: { ...config.headers, 'Authorization': 'Bearer ***' },
        dataType: data && data.constructor ? data.constructor.name : typeof data
      };
      console.log('AI请求参数:', JSON.stringify(logConfig, null, 2));
      
      // 如果是JSON数据，打印数据内容（排除FormData）
      if (data && typeof data === 'object' && data.constructor.name !== 'FormData') {
        console.log('请求数据:', JSON.stringify(data, null, 2));
      } else if (data && data.constructor.name === 'FormData') {
        console.log('请求数据: FormData (文件上传)');
      }

      const response = await axios(config);
      return {
        success: true,
        data: response.data,
        status: response.status,
        headers: response.headers
      };
    } catch (error) {
      console.error('API请求错误:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  }

  // 获取文件类型映射
  getFileType(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const typeMap = {
      'pdf': 'PDF',
      'docx': 'DOCX',
      'doc': 'DOC',
      'xls': 'XLS',
      'xlsx': 'XLSX',
      'ppt': 'PPT',
      'pptx': 'PPTX',
      'png': 'PNG',
      'jpg': 'JPG',
      'jpeg': 'JPEG',
      'csv': 'CSV',
      'txt': 'TXT',
      'md': 'MD',
      'html': 'HTML',
      'epub': 'EPUB',
      'bmp': 'BMP',
      'gif': 'GIF',
      'webp': 'WEBP',
      'heic': 'HEIC',
      'eps': 'EPS',
      'icns': 'ICNS',
      'im': 'IM',
      'pcx': 'PCX',
      'ppm': 'PPM',
      'tiff': 'TIFF',
      'xbm': 'XBM',
      'heif': 'HEIF',
      'jp2': 'JP2'
    };
    return typeMap[ext] || 'TXT';
  }

  // 创建文件解析任务
  async createParseTask(file, options = {}) {
    try {
      console.log('创建文件解析任务入参:');
      console.log('- 文件名:', file.originalname || file.name);
      console.log('- 文件大小:', file.size || (file.buffer ? file.buffer.length : 'unknown'));
      console.log('- MIME类型:', file.mimetype || 'unknown');
      console.log('- Buffer类型:', file.buffer ? file.buffer.constructor.name : 'none');
      console.log('- 选项:', JSON.stringify(options, null, 2));
      
      const FormData = require('form-data');
      const formData = new FormData();
      
      // 处理文件缓冲区
      let fileBuffer;
      if (Array.isArray(file.buffer)) {
        // 如果buffer是数组，转换为Buffer对象
        fileBuffer = Buffer.from(file.buffer);
      } else if (Buffer.isBuffer(file.buffer)) {
        // 如果已经是Buffer对象，直接使用
        fileBuffer = file.buffer;
      } else {
        throw new Error('不支持的文件缓冲区格式');
      }
      
      // 添加文件
      formData.append('file', fileBuffer, {
        filename: file.originalname || file.name,
        contentType: file.mimetype || 'application/octet-stream'
      });
      
      // 添加解析工具类型
      const toolType = options.toolType || 'lite';
      formData.append('tool_type', toolType);
      
      // 添加文件类型
      const fileType = this.getFileType(file.originalname || file.name);
      formData.append('file_type', fileType);

      const response = await this.makeRequest('/files/parser/create', formData, {
        method: 'POST',
        headers: formData.getHeaders()
      });

      return response;
    } catch (error) {
      console.error('创建文件解析任务错误:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 获取文件解析结果
  async getParseResult(taskId, formatType = 'text') {
    try {
      const response = await this.makeRequest(`/files/parser/result/${taskId}/${formatType}`, null, {
        method: 'GET'
      });

      return response;
    } catch (error) {
      console.error('获取文件解析结果错误:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 轮询等待解析完成
  async waitForParseCompletion(taskId, maxWaitTime = 900000, pollInterval = 300000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const result = await this.getParseResult(taskId, 'text');
      
      if (!result.success) {
        return result;
      }
      
      const status = result.data.status;
      
      if (status === 'succeeded') {
        return {
          success: true,
          content: result.data.content,
          taskId: taskId,
          message: result.data.message
        };
      } else if (status === 'failed') {
        return {
          success: false,
          error: result.data.message || '文件解析失败',
          taskId: taskId
        };
      }
      
      // 等待一段时间后继续轮询
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
    
    // 超时
    return {
      success: false,
      error: '文件解析超时',
      taskId: taskId
    };
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
      console.log('\n=== AI聊天请求 ===');
      console.log('聊天入参:');
      console.log('- 消息:', message);
      console.log('- 选项:', JSON.stringify(options, null, 2));
      console.log('- 历史记录长度:', this.conversationHistory.length);
      
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

      const requestData = {
        model: options.model || this.getDefaultModel(),
        messages: messages,
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
        stream: options.stream || false,
        top_p: options.topP || 0.9,
        presence_penalty: options.presencePenalty || 0.1,
        frequency_penalty: options.frequencyPenalty || 0.1
      };

      const response = await this.makeRequest('/chat/completions', requestData);

      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }

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
      console.error('AI聊天错误:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 文件内容分析（修改为接受file对象并使用新的文件解析接口）
  async analyzeFile(file, options = {}) {
    // 智谱ai 2025.10.08 开始收费0.01元/次， 解析缓慢，只有一行字的txt文件就要解析好几分钟
    try {
      console.log('\n=== 开始文件分析 ===');
      console.log('文件分析入参:');
      console.log('- 文件对象:', {
        originalname: file.originalname || file.name,
        size: file.size,
        mimetype: file.mimetype,
        bufferType: file.buffer ? file.buffer.constructor.name : 'none',
        bufferLength: file.buffer ? file.buffer.length : 0
      });
      console.log('- 分析选项:', JSON.stringify(options, null, 2));
      
      // 检查文件大小限制
      if (file.size > 10 * 1024 * 1024) { // 10MB限制
        return {
          success: false,
          error: '文件过大，无法分析'
        };
      }

      const fileName = file.originalname || file.name || 'unknown';
      console.log(`开始分析文件: ${fileName}`);

      // 创建文件解析任务
      console.log('创建文件解析任务...');
      const createResult = await this.createParseTask(file, options);
      
      if (!createResult.success) {
        return {
          success: false,
          error: `创建解析任务失败: ${createResult.error}`
        };
      }

      const taskId = createResult.data.task_id;
      console.log(`文件解析任务创建成功，任务ID: ${taskId}`);
      
      // 等待解析完成
      console.log('等待文件解析完成...');
      const parseResult = await this.waitForParseCompletion(taskId);
      
      if (!parseResult.success) {
        return {
          success: false,
          error: `文件解析失败: ${parseResult.error}`
        };
      }

      console.log('文件解析完成');
      return {
        success: true,
        content: parseResult.content,
        taskId: taskId,
        fileName: fileName,
        fileSize: file.size
      };

    } catch (error) {
      console.error('文件分析错误:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 图片分析（支持上下文）
  async analyzeImage(base64Image, filePath, options = {}) {
    try {
      console.log('\n=== 图片分析请求 ===');
      console.log('图片分析入参:');
      console.log('- 文件路径:', filePath);
      console.log('- base64数据长度:', base64Image ? base64Image.length : 0);
      console.log('- 分析选项:', JSON.stringify(options, null, 2));
      
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

      const requestData = {
        model: options.model || 'glm-4.5v',
        messages: messages,
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
        top_p: 0.9,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      };

      const response = await this.makeRequest('/chat/completions', requestData);

      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }

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
      console.error('图片分析错误:', error.message);
      return {
        success: false,
        error: error.message
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