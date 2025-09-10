// @ts-nocheck
require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const fs = require('fs');
const AIService = require('./ai-service');

// 创建Koa应用实例
const app = new Koa();
const router = new Router();

// 初始化AI服务
const aiService = new AIService();

// 中间件
app.use(cors());
app.use(bodyParser());

// 路由：获取可用的AI提供商和模型
router.get('/api/ai/providers', async (ctx) => {
  ctx.body = {
    success: true,
    data: {
      available: aiService.getAvailableProviders(),
      current: aiService.currentProvider,
      models: aiService.getSupportedModels(),
      visionModels: ['glm-4v', 'glm-4-vision', 'glm-4.5v']
    }
  };
});

// 路由：设置AI提供商
router.post('/api/ai/set-provider', async (ctx) => {
  const { provider } = ctx.request.body;
  
  if (!provider) {
    ctx.body = {
      success: false,
      error: '请提供提供商名称'
    };
    return;
  }

  const success = aiService.setProvider(provider);
  if (success) {
    ctx.body = {
      success: true,
      message: `已切换到 ${provider} 提供商`
    };
  } else {
    ctx.body = {
      success: false,
      error: '不支持的提供商或API密钥未配置'
    };
  }
});

// 路由：AI聊天
router.post('/api/ai/chat', async (ctx) => {
  try {
    const { message, options = {} } = ctx.request.body;
    
    if (!message) {
      ctx.body = {
        success: false,
        error: '请提供消息内容'
      };
      return;
    }

    const result = await aiService.chat(message, options);
    ctx.body = result;
  } catch (error) {
    ctx.body = {
      success: false,
      error: error.message
    };
  }
});

// 路由：分析文件
router.post('/api/ai/analyze-file', async (ctx) => {
  try {
    const { filePath, options = {} } = ctx.request.body;
    
    if (!filePath) {
      ctx.body = {
        success: false,
        error: '请提供文件路径'
      };
      return;
    }

    // 构建完整路径
    const fullPath = path.join('D:/', filePath);
    
    if (!fs.existsSync(fullPath)) {
      ctx.body = {
        success: false,
        error: '文件不存在'
      };
      return;
    }

    const result = await aiService.analyzeFile(fullPath, options);
    ctx.body = result;
  } catch (error) {
    ctx.body = {
      success: false,
      error: error.message
    };
  }
});

// 路由：批量分析文件
router.post('/api/ai/batch-analyze', async (ctx) => {
  try {
    const { filePaths, options = {} } = ctx.request.body;
    
    if (!Array.isArray(filePaths) || filePaths.length === 0) {
      ctx.body = {
        success: false,
        error: '请提供文件路径数组'
      };
      return;
    }

    // 构建完整路径
    const fullPaths = filePaths.map(filePath => path.join('D:/', filePath));
    
    // 验证文件存在
    const validPaths = fullPaths.filter(fullPath => fs.existsSync(fullPath));
    
    if (validPaths.length === 0) {
      ctx.body = {
        success: false,
        error: '所有文件都不存在'
      };
      return;
    }

    const results = await aiService.batchAnalyze(validPaths, options);
    ctx.body = {
      success: true,
      data: results
    };
  } catch (error) {
    ctx.body = {
      success: false,
      error: error.message
    };
  }
});

// 路由：通过dataUrl解析图片（支持GLM-4.5V）
router.post('/api/ai/analyze-image-dataurl', async (ctx) => {
  const { dataUrl, prompt, model = 'glm-4.5v', maxTokens = 2000, temperature = 0.7 } = ctx.request.body;
  
  if (!dataUrl) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      error: '请提供图片的dataUrl'
    };
    return;
  }

  if (!prompt) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      error: '请提供分析提示词'
    };
    return;
  }

  try {
    console.log(`收到图片分析请求 - 模型: ${model}, 提示词: ${prompt.substring(0, 50)}...`);
    
    // 解析dataUrl获取图片数据
    const matches = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!matches) {
      throw new Error('无效的dataUrl格式');
    }

    const imageType = matches[1];
    const base64Data = matches[2];
    
    // 验证图片类型
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    if (!validTypes.includes(imageType)) {
      throw new Error(`不支持的图片类型: ${imageType}`);
    }

    // 将base64转换为Buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // 检查图片大小（限制10MB）
    if (imageBuffer.length > 10 * 1024 * 1024) {
      throw new Error('图片大小超过10MB限制');
    }

    // 创建临时文件路径
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const extension = imageType.split('/')[1];
    const tempFileName = `temp_${Date.now()}.${extension}`;
    const tempFilePath = path.join(tempDir, tempFileName);

    // 保存临时图片文件
    fs.writeFileSync(tempFilePath, imageBuffer);

    try {
      // 使用AI服务分析图片
      const startTime = Date.now();
      const result = await aiService.analyzeImage(tempFilePath, prompt, {
        model,
        maxTokens,
        temperature
      });

      const duration = Date.now() - startTime;

      // 清理临时文件
      fs.unlinkSync(tempFilePath);

      ctx.body = {
        success: true,
        data: {
          analysis: result.analysis,
          model: result.model,
          duration: duration,
          imageSize: imageBuffer.length,
          imageType: imageType,
          historyLength: result.historyLength
        }
      };

    } catch (error) {
      // 清理临时文件（即使出错）
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      throw error;
    }

  } catch (error) {
    console.error('图片分析失败:', error.message);
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: error.message
    };
  }
});

// 路由：获取对话历史
router.get('/api/ai/history', async (ctx) => {
  try {
    const history = aiService.getHistory();
    ctx.body = {
      success: true,
      data: {
        history,
        length: history.length / 2, // 对话轮数
        maxLength: aiService.maxHistoryLength
      }
    };
  } catch (error) {
    ctx.body = {
      success: false,
      error: error.message
    };
  }
});

// 路由：清空对话历史
router.post('/api/ai/clear-history', async (ctx) => {
  try {
    aiService.clearHistory();
    ctx.body = {
      success: true,
      message: '对话历史已清空'
    };
  } catch (error) {
    ctx.body = {
      success: false,
      error: error.message
    };
  }
});

// 路由：设置历史记录长度
router.post('/api/ai/set-history-length', async (ctx) => {
  try {
    const { length } = ctx.request.body;
    
    if (typeof length !== 'number' || length < 1 || length > 50) {
      ctx.body = {
        success: false,
        error: '历史记录长度必须在1-50之间'
      };
      return;
    }

    aiService.setMaxHistoryLength(length);
    ctx.body = {
      success: true,
      message: `历史记录长度已设置为 ${length}`
    };
  } catch (error) {
    ctx.body = {
      success: false,
      error: error.message
    };
  }
});

// 路由：获取文件内容预览（用于前端显示）
router.get('/api/ai/file-preview', async (ctx) => {
  try {
    const { path: filePath } = ctx.query;
    
    if (!filePath) {
      ctx.body = {
        success: false,
        error: '请提供文件路径'
      };
      return;
    }

    const fullPath = path.join('D:/', filePath);
    
    if (!fs.existsSync(fullPath)) {
      ctx.body = {
        success: false,
        error: '文件不存在'
      };
      return;
    }

    const stats = fs.statSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    
    // 支持的文本文件类型
    const textExts = ['.txt', '.md', '.json', '.js', '.py', '.html', '.css', '.xml', '.csv'];
    
    if (textExts.includes(ext) && stats.size < 100 * 1024) { // 100KB限制
      const content = fs.readFileSync(fullPath, 'utf-8');
      ctx.body = {
        success: true,
        data: {
          type: 'text',
          content: content.substring(0, 5000), // 限制预览长度
          fileName: path.basename(fullPath),
          fileSize: stats.size
        }
      };
    } else if (['.png', '.jpg', '.jpeg', '.gif', '.bmp'].includes(ext)) {
      ctx.body = {
        success: true,
        data: {
          type: 'image',
          fileName: path.basename(fullPath),
          fileSize: stats.size
        }
      };
    } else {
      ctx.body = {
        success: false,
        error: '不支持的文件类型或文件过大'
      };
    }
  } catch (error) {
    ctx.body = {
      success: false,
      error: error.message
    };
  }
});

// 应用路由
app.use(router.routes());
app.use(router.allowedMethods());

// 错误处理
app.on('error', (err, ctx) => {
  console.error('AI服务器错误:', err);
});

// 启动服务器
const PORT = process.env.AI_PORT || 4002;
app.listen(PORT, () => {
  console.log(`
  🤖 AI服务已启动 (智谱AI专用):
  - 本地地址: http://localhost:${PORT}
  - 可用端点:
    * GET  /api/ai/providers      - 获取AI提供商
    * POST /api/ai/set-provider  - 设置AI提供商
    * POST /api/ai/chat          - AI聊天
    * POST /api/ai/analyze-file  - 分析单个文件
    * POST /api/ai/batch-analyze - 批量分析文件
    * GET  /api/ai/file-preview  - 文件内容预览
  
  环境变量配置:
  - ZHIPU_API_KEY: ${process.env.ZHIPU_API_KEY ? '已配置 ✓' : '未配置 ✗'}
  - AI_PORT: ${PORT}
  `);
});

module.exports = { app, aiService };