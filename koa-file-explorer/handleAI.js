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

// 路由：分析文件（接受前端传入的文件对象）
router.post('/api/ai/analyze-file', async (ctx) => {
  try {
    const { file, options = {} } = ctx.request.body;
    
    // 检查是否有文件对象
    if (!file) {
      ctx.body = {
        success: false,
        error: '请提供文件对象'
      };
      return;
    }

    // 验证文件对象必要属性
    if (!file.buffer || !file.originalname) {
      ctx.body = {
        success: false,
        error: '文件对象格式不正确，需要包含buffer和originalname属性'
      };
      return;
    }
    
    console.log(`收到文件分析请求: ${file.originalname}, 大小: ${file.size || file.buffer.length} bytes`);

    // 调用AI服务分析文件
    const result = await aiService.analyzeFile(file, options);
    
    // 返回结果
    ctx.body = {
      ...result,
      fileName: file.originalname,
      fileSize: file.size || file.buffer.length
    };
  } catch (error) {
    console.error('文件分析错误:', error);
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
    * POST /api/ai/analyze-file  - 分析单个文件（接受文件对象）
    * POST /api/ai/batch-analyze - 批量分析文件
    * GET  /api/ai/file-preview  - 文件内容预览
  
  环境变量配置:
  - ZHIPU_API_KEY: ${process.env.ZHIPU_API_KEY ? '已配置 ✓' : '未配置 ✗'}
  - AI_PORT: ${PORT}
  
  注意: /api/ai/analyze-file 接受包含buffer和originalname的文件对象
  `);
});

module.exports = { app, aiService };