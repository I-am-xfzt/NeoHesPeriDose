// @ts-nocheck
const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const fs = require("fs");
const path = require("path");
const serve = require("koa-static");
const crypto = require("crypto");

// 创建Koa应用实例
const app = new Koa();
const router = new Router();

// 静态文件服务
app.use(serve(path.join(__dirname, "public")));

// 基础路径 - 改为同级目录下的GLBS文件夹
const BASE_PATH = path.join(__dirname, "GLBS");

// 存储有效的token（在生产环境中应该使用Redis或数据库）
const validTokens = new Set();

// Token验证中间件
const validateToken = async (ctx, next) => {
  try {
    // 从请求头获取token
    const authHeader = ctx.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

    // 检查token是否存在且有效
    if (!token || !validTokens.has(token)) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: "未授权访问，请先登录",
        code: 401,
      };
      return;
    }

    // token有效，继续执行下一个中间件
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: "Token验证失败",
      code: 401,
    };
  }
};

// 安全中间件 - 验证路径合法性
const validatePath = async (ctx, next) => {
  try {
    // 获取前端请求的路径参数
    let reqPath = ctx.query.path || "";
    // 解码URL编码的中文字符
    reqPath = decodeURIComponent(reqPath);
    // 安全检查：防止路径遍历攻击
    if (reqPath.includes("../") || reqPath.includes("..\\")) {
      ctx.throw(400, "非法路径请求");
      return;
    }

    // 构建完整路径并标准化
    let fullPath = path.join(BASE_PATH, reqPath);
    fullPath = path.normalize(fullPath);

    // 确保路径仍在GLBS目录内
    if (!fullPath.startsWith(BASE_PATH)) {
      ctx.throw(403, "只能访问GLBS目录内容");
      return;
    }

    // 检查路径是否存在
    if (!fs.existsSync(fullPath)) {
      ctx.throw(404, "路径不存在");
      return;
    }

    // 将验证后的路径存入上下文
    ctx.state.fullPath = fullPath;
    await next();
  } catch (err) {
    ctx.throw(500, `路径验证错误: ${err.message}`);
  }
};

// 定义API路由

// 登录接口
router.post("/api/login-module/login", async (ctx) => {
  try {
    console.log("登录接口被调用");

    const { username, password } = ctx.request.body;

    // 校验账号密码
    if (username === "admin" && password === "123456") {
      // 生成UUID格式的token
      const token = crypto.randomUUID();

      // 将token添加到有效token集合中
      validTokens.add(token);

      ctx.body = {
        success: true,
        code: 200,
        message: "登录成功",
        token: token,
      };
    } else {
      ctx.status = 401;
      ctx.body = {
        success: false,
        code: 401,
        message: "用户名或密码错误",
      };
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      code: 500,
      message: `登录失败: ${err.message}`,
    };
  }
});

// 登出接口
router.post("/api/login-module/logout", validateToken, async (ctx) => {
  try {
    const authHeader = ctx.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (token) {
      // 从有效token集合中移除token
      validTokens.delete(token);
    }

    ctx.body = {
      success: true,
      code: 200,
      message: "登出成功",
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      code: 500,
      message: `登出失败: ${err.message}`,
    };
  }
});

// 获取目录内容
router.get("/api/files", validateToken, validatePath, async (ctx) => {
  try {
    const stats = fs.statSync(ctx.state.fullPath);

    if (stats.isDirectory()) {
      const files = fs.readdirSync(ctx.state.fullPath).map((file) => {
        const filePath = path.join(ctx.state.fullPath, file);
        const fileStats = fs.statSync(filePath);

        return {
          name: file,
          path: path.relative(BASE_PATH, filePath).replace(/\\/g, "/"),
          type: fileStats.isDirectory() ? "directory" : "file",
          size: fileStats.size,
          modified: fileStats.mtime.toISOString(),
          extension: path.extname(file).toLowerCase(),
        };
      });

      ctx.body = {
        success: true,
        code: 200,
        data: files.sort((a, b) => {
          // 目录排在前面
          if (a.type === "directory" && b.type !== "directory") return -1;
          if (a.type !== "directory" && b.type === "directory") return 1;
          return a.name.localeCompare(b.name);
        }),
      };
    } else {
      // 如果是单个文件也返回统一格式
      ctx.body = {
        success: true,
        code: 200,
        data: [
          {
            name: path.basename(ctx.state.fullPath),
            path: path.relative(BASE_PATH, ctx.state.fullPath).replace(/\\/g, "/"),
            type: "file",
            size: stats.size,
            modified: stats.mtime.toISOString(),
            extension: path.extname(ctx.state.fullPath).toLowerCase(),
          },
        ],
      };
    }
  } catch (err) {
    ctx.body = {
      success: false,
      code: 500,
      message: `读取目录失败: ${err.message}`,
    };
  }
});

// 获取二进制文件
router.get("/api/binary-file", validateToken, validatePath, async (ctx) => {
  try {
    const filePath = ctx.state.fullPath;
    const stats = fs.statSync(filePath);

    // 检查是否为文件
    if (stats.isDirectory()) {
      ctx.throw(400, "请求路径是目录而不是文件");
    }

    // 设置适当的Content-Type
    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      {
        ".glb": "model/gltf-binary",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".pdf": "application/pdf",
        ".json": "application/json",
      }[ext] || "application/octet-stream";

    // 设置响应头
    ctx.set("Content-Type", contentType);
    ctx.set("Content-Length", stats.size);
    ctx.set("Content-Disposition", `inline; filename="${path.basename(filePath)}"`);

    // 创建文件流并返回
    ctx.body = fs.createReadStream(filePath);
  } catch (err) {
    ctx.throw(500, `读取二进制文件失败: ${err.message}`);
  }
});

// 获取models目录下的3D模型文件（无需token验证）
router.get(/^\/api\/models\/([^/]+)\/(.+)$/, async (ctx) => {
  try {
    // 使用正则表达式捕获参数
    const category = decodeURIComponent(ctx.captures[0]); // 第一个捕获组：分类
    const filePath = decodeURIComponent(ctx.captures[1]); // 第二个捕获组：文件路径（URL解码）

    // 验证分类目录（只允许访问BabyLon和THREE目录）
    const allowedCategories = ["BabyLon", "THREE"];
    if (!allowedCategories.includes(category)) {
      ctx.status = 403;
      ctx.body = {
        success: false,
        code: 403,
        message: "只能访问BabyLon或THREE分类目录",
      };
      return;
    }

    // 检查文件路径是否存在
    if (!filePath) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        code: 400,
        message: "请提供文件路径",
      };
      return;
    }

    // 验证文件扩展名（只允许.gltf、.glb、.splat及相关纹理文件）
    const filename = path.basename(filePath);
    const ext = path.extname(filename).toLowerCase();
    const allowedExtensions = [".gltf", ".glb", ".splat", ".png", ".jpg", ".jpeg", ".bin", ".webp", ".babylon"];
    if (!allowedExtensions.includes(ext)) {
      ctx.status = 403;
      ctx.body = {
        success: false,
        code: 403,
        message: "只支持.gltf、.glb、.splat、.png、.jpg、.webp、.babylon、.jpeg、.bin格式的文件",
      };
      return;
    }

    // 安全检查：防止路径遍历攻击
    if (filePath.includes('../') || filePath.includes('..\\')) {
      ctx.status = 403;
      ctx.body = {
        success: false,
        code: 403,
        message: "检测到非法路径字符",
      };
      return;
    }

    // 构建完整文件路径
    const modelsPath = path.join(BASE_PATH, "models", category, filePath);

    // 安全检查：确保路径在指定分类目录内
    const normalizedPath = path.normalize(modelsPath);
    const categoryBasePath = path.normalize(path.join(BASE_PATH, "models", category));
    if (!normalizedPath.startsWith(categoryBasePath)) {
      ctx.status = 403;
      ctx.body = {
        success: false,
        code: 403,
        message: "路径安全检查失败",
      };
      return;
    }

    // 检查文件是否存在
    if (!fs.existsSync(normalizedPath)) {
      console.log(`文件不存在调试信息:`);
      console.log(`- 原始分类: ${ctx.captures[0]}`);
      console.log(`- 原始文件路径: ${ctx.captures[1]}`);
      console.log(`- 解码后分类: ${category}`);
      console.log(`- 解码后文件路径: ${filePath}`);
      console.log(`- 完整路径: ${normalizedPath}`);
      
      ctx.status = 404;
      ctx.body = {
        success: false,
        code: 404,
        message: "文件不存在",
        debug: {
          category,
          filePath,
          fullPath: normalizedPath
        }
      };
      return;
    }

    const stats = fs.statSync(normalizedPath);

    // 确保是文件而不是目录
    if (stats.isDirectory()) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        code: 400,
        message: "请求路径是目录而不是文件",
      };
      return;
    }

    // 设置适当的Content-Type
    const contentType =
      {
        ".gltf": "model/gltf+json",
        ".glb": "model/gltf-binary",
        ".splat": "application/octet-stream",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".bin": "application/octet-stream",
        ".babylon": "model/vnd.babylonjs.v3+json"
      }[ext] || "application/octet-stream";

    // 设置响应头
    ctx.set("Content-Type", contentType);
    ctx.set("Content-Length", stats.size);
    ctx.set("Content-Disposition", `inline; filename="${filename}"`);
    ctx.set("Cache-Control", "public, max-age=3600"); // 缓存1小时

    // 创建文件流并返回
    ctx.body = fs.createReadStream(normalizedPath);

    console.log(`成功返回模型文件: ${category}/${filePath}, 大小: ${stats.size} bytes`);
  } catch (err) {
    console.error("获取模型文件错误:", err);
    ctx.status = 500;
    ctx.body = {
      success: false,
      code: 500,
      message: `获取模型文件失败: ${err.message}`,
    };
  }
});

// JSON文件操作接口
router.post("/api/json/:operation", validateToken, validatePath, async (ctx) => {
  try {
    const filePath = ctx.state.fullPath;
    const operation = ctx.params.operation;
    const { data } = ctx.request.body;

    // 检查是否为JSON文件
    if (path.extname(filePath).toLowerCase() !== ".json") {
      ctx.throw(400, "只能操作JSON文件");
    }

    let jsonData = {};

    // 如果文件存在，读取现有内容
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      jsonData = JSON.parse(fileContent);
    }

    // 根据操作类型处理
    switch (operation) {
      case "add":
        // 添加新数据
        if (!data || typeof data !== "object") {
          ctx.throw(400, "需要提供有效的数据对象");
        }
        Object.assign(jsonData, data);
        break;

      case "update":
        // 更新现有数据
        if (!data || typeof data !== "object") {
          ctx.throw(400, "需要提供有效的数据对象");
        }
        Object.assign(jsonData, data);
        break;

      case "delete":
        // 删除指定键
        if (!data || !Array.isArray(data)) {
          ctx.throw(400, "需要提供要删除的键数组");
        }
        data.forEach((key) => {
          delete jsonData[key];
        });
        break;

      case "replace":
        // 完全替换内容
        if (!data || typeof data !== "object") {
          ctx.throw(400, "需要提供有效的数据对象");
        }
        jsonData = data;
        break;

      default:
        ctx.throw(400, "不支持的操作类型");
    }

    // 写回文件
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

    ctx.body = {
      success: true,
      code: 200,
      message: `JSON文件${operation}操作成功`,
      data: jsonData,
    };
  } catch (err) {
    ctx.throw(500, `JSON操作失败: ${err.message}`);
  }
});

// 应用中间件
app.use(
  cors({
    origin: (ctx) => {
      // 更灵活的安全控制，允许本地开发源
      const allowedOrigins = ["http://192.168.110.165", "http://127.0.0.1:5500"];
      const origin = ctx.headers.origin;
      if (allowedOrigins.includes(origin)) {
        return origin;
      }
      return "";
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// 解析请求体
app.use(require("koa-bodyparser")());

app.use(router.routes());
app.use(router.allowedMethods());

// 错误处理
app.on("error", (err, ctx) => {
  console.error("服务器错误:", err);
  ctx.body = {
    success: false,
    code: 500,
    message: "内部服务器错误",
  };
});

// 启动服务器
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
  - 可访问GLBS目录内容
  - 安全限制: 仅允许来自指定源的请求
  
  警告: 此服务仅限本地开发使用!
  `);
});
