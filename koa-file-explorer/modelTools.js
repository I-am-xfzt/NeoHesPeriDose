// ================== 3D模型文件相关工具函数 ==================

/**
 * 验证模型文件分类
 * @param {string} category - 分类名称
 * @returns {boolean} 是否为允许的分类
 */
const isValidModelCategory = (category) => {
  const allowedCategories = ["BabyLon", "THREE"];
  return allowedCategories.includes(category);
};

/**
 * 验证文件扩展名
 * @param {string} filename - 文件名
 * @returns {boolean} 是否为允许的扩展名
 */
const isValidModelExtension = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const allowedExtensions = [".gltf", ".glb", ".splat", ".png", ".jpg", ".jpeg", ".bin", ".webp", ".babylon"];
  return allowedExtensions.includes(ext);
};

/**
 * 获取文件的Content-Type
 * @param {string} filename - 文件名
 * @returns {string} Content-Type
 */
const getModelContentType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const contentTypes = {
    ".gltf": "model/gltf+json",
    ".glb": "model/gltf-binary",
    ".splat": "application/octet-stream",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".bin": "application/octet-stream",
    ".babylon": "model/vnd.babylonjs.v3+json",
  };
  return contentTypes[ext] || "application/octet-stream";
};

/**
 * 验证和构建模型文件路径
 * @param {string} category - 分类
 * @param {string} filePath - 文件路径
 * @returns {object} 验证结果
 */
const validateModelPath = (category, filePath) => {
  // 验证分类目录
  if (!isValidModelCategory(category)) {
    return {
      isValid: false,
      error: "只能访问BabyLon或THREE分类目录",
      statusCode: 403,
    };
  }

  // 检查文件路径是否存在
  if (!filePath) {
    return {
      isValid: false,
      error: "请提供文件路径",
      statusCode: 400,
    };
  }

  // 验证文件扩展名
  const filename = path.basename(filePath);
  if (!isValidModelExtension(filename)) {
    return {
      isValid: false,
      error: "只支持.gltf、.glb、.splat、.png、.jpg、.webp、.babylon、.jpeg、.bin格式的文件",
      statusCode: 403,
    };
  }

  // 安全检查：防止路径遍历攻击
  if (filePath.includes("../") || filePath.includes("..\\")) {
    return {
      isValid: false,
      error: "检测到非法路径字符",
      statusCode: 403,
    };
  }

  // 构建完整文件路径
  const modelsPath = path.join(BASE_PATH, "models", category, filePath);
  const normalizedPath = path.normalize(modelsPath);
  const categoryBasePath = path.normalize(path.join(BASE_PATH, "models", category));

  // 安全检查：确保路径在指定分类目录内
  if (!normalizedPath.startsWith(categoryBasePath)) {
    return {
      isValid: false,
      error: "路径安全检查失败",
      statusCode: 403,
    };
  }

  return {
    isValid: true,
    normalizedPath,
    filename,
  };
};
module.exports = {
  isValidModelCategory,
  isValidModelExtension,
  getModelContentType,
  validateModelPath,
};
