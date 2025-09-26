// @ts-nocheck
require("dotenv").config();
const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const fs = require("fs");
const path = require("path");
const serve = require("koa-static");
const crypto = require("crypto");
const { createResponse, validatePaginationParams, handlePagination, handleError, handleJson } = require("./common.js");
const { validateModelPath, getModelContentType, isValidModelCategory, isValidModelExtension } = require("./modelTools.js");
const { searchData } = require("./search.js");
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
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    // 检查token是否存在且有效
    if (!token || !validTokens.has(token)) {
      ctx.status = 401;
      ctx.body = createResponse(false, 401, "未授权访问，请先登录");
      return;
    }
    // token有效，继续执行下一个中间件
    await next();
  } catch (err) {
    console.error(err);
    ctx.status = 401;
    ctx.body = createResponse(false, 401, "Token验证失败");
  }
};
// ================== 中间件函数 ==================
const createFullPath = (ctx, reqPath) => {
  console.log(reqPath, 'reqPath');
  let fullPath = path.join(BASE_PATH, reqPath);
  fullPath = path.normalize(fullPath);
  // 确保路径在GLBS目录内
  if (!fullPath.startsWith(BASE_PATH)) {
    ctx.throw(403, "只能访问GLBS目录内容");
    throw new Error('只能访问GLBS目录内容')
  }
  // 检查文件是否存在
  if (!fs.existsSync(fullPath)) {
    console.log(fullPath);
    ctx.throw(404, "文件不存在");
    throw new Error('文件不存在')
  }
  return fullPath
};
// 安全中间件 - 验证路径合法性
const validatePath = async (ctx, next) => {
  try {
    let reqPath = "";
    console.log(ctx.params, ctx.request.url, ctx.query, "validatePath");

    if (ctx.params.dict) {
      reqPath = "dict/" + ctx.params.dict;
    } else if (ctx.params.path) {
      reqPath = ctx.params.path;
    } else {
      reqPath = ctx.query.path || "";
    }

    // 解码URL编码的中文字符
    reqPath = decodeURIComponent(reqPath);

    // 安全检查
    if (reqPath.includes("../") || reqPath.includes("..\\")) {
      ctx.throw(400, "非法路径请求");
      return;
    }
    // 自动添加 json/ 文件夹路径
    if (!reqPath.startsWith("json/")) {
      reqPath = "json/" + reqPath;
    }

    // 自动添加 .json 后缀
    if (!reqPath.endsWith(".json")) {
      reqPath += ".json";
    }

    // 构建完整路径
    let fullPath = createFullPath(ctx, reqPath)
    console.log(fullPath, "文件路径");
    ctx.state.fullPath = fullPath;
    await next();
  } catch (err) {
    console.error(`路径验证错误: ${err}`);
  }
};
/**
 * 读取JSON文件内容
 * @param {string} filePath - 文件路径
 * @returns {object} 解析后的JSON数据
 */
const readJsonFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContent);
};

// ================== API路由定义 ==================

// 登录接口
router.post("/api/login-module/login", async (ctx) => {
  try {
    const { username, password } = ctx.request.body;

    // 校验账号密码
    if (username === "admin" && password === "123456") {
      // 生成UUID格式的token
      const token = crypto.randomUUID();

      // 将token添加到有效token集合中
      validTokens.add(token);

      ctx.body = createResponse(true, 200, "登录成功", token);
    } else {
      ctx.status = 401;
      ctx.body = createResponse(false, 401, "用户名或密码错误");
    }
  } catch (err) {
    handleError(ctx, err, "登录");
  }
});

// 登出接口
router.post("/api/login-module/logout", async (ctx) => {
  try {
    validTokens.clear();
    ctx.body = createResponse(true, 200, "登出成功");
  } catch (err) {
    handleError(ctx, err, "登出");
  }
});

// 获取JSON文件数据（支持分页）
router.get("/api/binary/:path", validateToken, validatePath, async (ctx) => {
  try {
    const filePath = ctx.state.fullPath;
    const stats = fs.statSync(filePath);
    // 读取JSON文件内容
    const jsonData = readJsonFile(filePath);
    // 验证分页参数
    const validation = validatePaginationParams(ctx.query.current, ctx.query.size);
    if (!validation.isValid) {
      ctx.body = createResponse(false, 400, validation.error);
      return;
    }
    // 处理分页
    const paginationResult = handlePagination(jsonData, validation.page, validation.pageSize);
    ctx.body = createResponse(true, 200, "获取数据成功", paginationResult.data);
  } catch (err) {
    handleError(ctx, err, "读取JSON文件");
  }
});
// 获取字典数据
router.get("/api/binary/dict/:dict", validateToken, validatePath, async (ctx) => {
  try {
    const filePath = ctx.state.fullPath;
    const stats = fs.statSync(filePath);
    // 读取JSON文件内容
    let jsonData = readJsonFile(filePath);
    // 验证分页参数
    const validation = validatePaginationParams(ctx.query.current, ctx.query.size);
    if (!validation.isValid) {
      ctx.body = createResponse(false, 400, validation.error);
      return;
    }
    if (ctx.query.label) {
      jsonData = searchData(jsonData, ctx.query.label, ["label"]);
    }
    // 处理分页
    const paginationResult = handlePagination(jsonData, validation.page, validation.pageSize);
    ctx.body = createResponse(true, 200, "获取数据成功", paginationResult.data);
  } catch (err) {
    handleError(ctx, err, "读取JSON文件");
  }
});
// 获取题库数据(支持分页)
router.get("/api/binary/question/:path", validateToken, validatePath, async (ctx) => {
  try {
    const filePath = ctx.state.fullPath;
    const stats = fs.statSync(filePath);
    // 读取JSON文件内容
    let jsonData = readJsonFile(filePath);
    // 验证分页参数
    const validation = validatePaginationParams(ctx.query.current, ctx.query.size);
    if (!validation.isValid) {
      ctx.body = createResponse(false, 400, validation.error);
      return;
    }
    if (ctx.query.title) {
      jsonData = searchData(jsonData, ctx.query.title, ["title", "content"]);
    }
    if (ctx.query.category && ctx.query.category !== "全部") {
      jsonData = jsonData.filter((item) => item.category === ctx.query.category);
    }
    // 处理分页
    const paginationResult = handlePagination(jsonData, validation.page, validation.pageSize);
    ctx.body = createResponse(true, 200, "获取数据成功", paginationResult.data);
  } catch (err) {
    handleError(ctx, err, "读取JSON文件");
  }
});
router.post("/api/binary/handle/question/:operation", validateToken, async (ctx) => {
  try {
    const data = ctx.request.body;
    const filePath = createFullPath(ctx, `json/${data.fileName}.json`);
    const operation = ctx.params.operation;
    console.log(data, filePath);

    let jsonData = {};
    // 如果文件存在，读取现有内容
    if (fs.existsSync(filePath)) {
      jsonData = readJsonFile(filePath);
    } else {
      ctx.body = createResponse(false, 500, "文件路径不存在，不可操作");
      return;
    }
    const resultData = handleJson(jsonData, operation, data.json);
    if (resultData.success) {
      fs.writeFileSync(filePath, JSON.stringify(resultData.data, null, 2));
      resultData.data = null;
    }
    ctx.body = resultData;
  } catch (err) {
    handleError(ctx, err, "处理题库");
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
      jsonData = readJsonFile(filePath);
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

    ctx.body = createResponse(true, 200, `JSON文件${operation}操作成功`, jsonData);
  } catch (err) {
    handleError(ctx, err, "JSON操作");
  }
});

// 获取models目录下的3D模型文件（无需token验证）
router.get(/^\/api\/models\/([^/]+)\/(.+)$/, async (ctx) => {
  try {
    // 使用正则表达式捕获参数
    const category = decodeURIComponent(ctx.captures[0]); // 第一个捕获组：分类
    const filePath = decodeURIComponent(ctx.captures[1]); // 第二个捕获组：文件路径（URL解码）

    // 验证路径
    const validation = validateModelPath(category, filePath);
    if (!validation.isValid) {
      ctx.status = validation.statusCode;
      ctx.body = createResponse(false, validation.statusCode, validation.error);
      return;
    }

    const { normalizedPath, filename } = validation;

    // 检查文件是否存在
    if (!fs.existsSync(normalizedPath)) {
      console.log(`文件不存在调试信息:`);
      console.log(`- 原始分类: ${ctx.captures[0]}`);
      console.log(`- 原始文件路径: ${ctx.captures[1]}`);
      console.log(`- 解码后分类: ${category}`);
      console.log(`- 解码后文件路径: ${filePath}`);
      console.log(`- 完整路径: ${normalizedPath}`);

      ctx.status = 404;
      ctx.body = createResponse(false, 404, "文件不存在", {
        category,
        filePath,
        fullPath: normalizedPath,
      });
      return;
    }

    const stats = fs.statSync(normalizedPath);

    // 确保是文件而不是目录
    if (stats.isDirectory()) {
      ctx.status = 400;
      ctx.body = createResponse(false, 400, "请求路径是目录而不是文件");
      return;
    }

    // 设置适当的Content-Type
    const contentType = getModelContentType(filename);

    // 设置响应头
    ctx.set("Content-Type", contentType);
    ctx.set("Content-Length", stats.size);
    ctx.set("Content-Disposition", `inline; filename="${filename}"`);
    ctx.set("Cache-Control", "public, max-age=3600"); // 缓存1小时

    // 创建文件流并返回
    ctx.body = fs.createReadStream(normalizedPath);

    console.log(`成功返回模型文件: ${category}/${filePath}, 大小: ${stats.size} bytes`);
  } catch (err) {
    handleError(ctx, err, "获取模型文件");
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
const PORT = process.env.JSON_PORT || 4000;
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
