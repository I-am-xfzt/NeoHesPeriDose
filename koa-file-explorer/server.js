const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const fs = require('fs');
const path = require('path');

const serve = require('koa-static');


// 1. 创建Koa应用实例
const app = new Koa();
const router = new Router();
// 静态文件服务 (放在app.use(router.routes())之前)
app.use(serve(path.join(__dirname, 'public')));
// 2. 安全中间件 - 验证路径合法性
const validatePath = async (ctx, next) => {
  try {
    // 获取前端请求的路径参数
    const reqPath = ctx.query.path || '';
    
    // 安全检查：防止路径遍历攻击
    if (reqPath.includes('../') || reqPath.includes('..\\')) {
      ctx.throw(400, '非法路径请求');
      return;
    }
    
    // 构建完整路径并标准化
    let fullPath = path.join('D:/', reqPath);
    fullPath = path.normalize(fullPath);
    
    // 确保路径仍在D盘内
    if (!fullPath.startsWith('D:\\')) {
      ctx.throw(403, '只能访问D盘内容');
      return;
    }
    
    // 检查路径是否存在
    if (!fs.existsSync(fullPath)) {
      ctx.throw(404, '路径不存在');
      return;
    }
    
    // 将验证后的路径存入上下文
    ctx.state.fullPath = fullPath;
    await next();
  } catch (err) {
    ctx.throw(500, `路径验证错误: ${err.message}`);
  }
};

// 3. 定义API路由

// 3.1 获取目录内容
router.get('/api/files', validatePath, async (ctx) => {
  try {
    const stats = fs.statSync(ctx.state.fullPath);
    
    if (stats.isDirectory()) {
      const files = fs.readdirSync(ctx.state.fullPath).map(file => {
        const filePath = path.join(ctx.state.fullPath, file);
        const fileStats = fs.statSync(filePath);
        
        return {
          name: file,
          path: path.relative('D:/', filePath).replace(/\\/g, '/'),
          type: fileStats.isDirectory() ? 'directory' : 'file',
          size: fileStats.size,
          modified: fileStats.mtime.toISOString(),
          extension: path.extname(file).toLowerCase()
        };
      });
      
      ctx.body = {
        success: true,
        data: files.sort((a, b) => {
          // 目录排在前面
          if (a.type === 'directory' && b.type !== 'directory') return -1;
          if (a.type !== 'directory' && b.type === 'directory') return 1;
          return a.name.localeCompare(b.name);
        })
      };
    } else {
      // 如果是单个文件也返回统一格式
      ctx.body = {
        success: true,
        data: [{
          name: path.basename(ctx.state.fullPath),
          path: path.relative('D:/', ctx.state.fullPath).replace(/\\/g, '/'),
          type: 'file',
          size: stats.size,
          modified: stats.mtime.toISOString(),
          extension: path.extname(ctx.state.fullPath).toLowerCase()
        }]
      };
    }
  } catch (err) {
    ctx.body = {
      success: false,
      message: `读取目录失败: ${err.message}`
    };
  }
});

// 新增二进制文件路由
router.get('/api/binary-file', validatePath, async (ctx) => {
  try {
    const filePath = ctx.state.fullPath;
    const stats = fs.statSync(filePath);
    
    // 检查是否为文件
    if (stats.isDirectory()) {
      ctx.throw(400, '请求路径是目录而不是文件');
    }
    
    // 设置适当的Content-Type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
      '.glb': 'model/gltf-binary',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf'
    }[ext] || 'application/octet-stream';
    
    // 设置响应头
    ctx.set('Content-Type', contentType);
    ctx.set('Content-Length', stats.size);
    ctx.set('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
    
    // 创建文件流并返回
    ctx.body = fs.createReadStream(filePath);
  } catch (err) {
    ctx.throw(500, `读取二进制文件失败: ${err.message}`);
  }
});

// 4. 应用中间件
app.use(cors({
  origin: ctx => {
    // 更灵活的安全控制，允许本地开发源
    const allowedOrigins = ['http://192.168.110.165', 'http://127.0.0.1:5500'];
    const origin = ctx.headers.origin;
    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    return '';
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

app.use(router.routes());
app.use(router.allowedMethods());

// 5. 错误处理
app.on('error', (err, ctx) => {
  console.error('服务器错误:', err);
  ctx.body = {
    success: false,
    message: '内部服务器错误'
  };
});

// 6. 启动服务器
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`
  ███████╗██╗██╗     ███████╗    ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗ 
  ██╔════╝██║██║     ██╔════╝    ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
  █████╗  ██║██║     █████╗      ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
  ██╔══╝  ██║██║     ██╔══╝      ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
  ██║     ██║███████╗███████╗    ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
  ╚═╝     ╚═╝╚══════╝╚══════╝    ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝
  
  文件服务已启动:
  - 本地地址: http://localhost:${PORT}
  - 可访问D盘内容
  - 安全限制: 仅允许来自 http://localhost:3000 的请求
  
  警告: 此服务仅限本地开发使用!
  `);
});