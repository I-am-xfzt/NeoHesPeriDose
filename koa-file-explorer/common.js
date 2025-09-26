// @ts-nocheck
// ================== 公共工具函数 ==================

/**
 * 统一响应格式
 * @param {boolean} success - 是否成功
 * @param {number} code - 状态码
 * @param {string} message - 消息
 * @param {any} data - 数据
 * @returns {object} 响应对象
 */
const createResponse = (success, code, message, data = null) => {
  const response = {
    success,
    code,
    message,
    msg: message,
  };

  if (data !== null) {
    response.data = data;
  }

  // 兼容某些接口的msg字段
  if (success) {
    response.msg = message;
  }

  return response;
};
/**
 * 分页处理函数
 * @param {Array} data - 原始数据数组
 * @param {number|null} page - 页码
 * @param {number|null} pageSize - 每页大小
 * @returns {object} 分页结果
 */
const handlePagination = (data, page, pageSize) => {
  // 如果不是数组或者没有分页参数，直接返回原数据
  if (!Array.isArray(data) || !page || !pageSize || page <= 0 || pageSize <= 0) {
    return { data, isPaginated: false };
  }

  const total = data.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: {
      data: paginatedData,
      page: page,
      pageSize: pageSize,
      total: total,
      totalPages: Math.ceil(total / pageSize),
    },
    isPaginated: true,
  };
};

/**
 * 验证分页参数
 * @param {string|number} page - 页码
 * @param {string|number} pageSize - 每页大小
 * @returns {object} 验证结果
 */
const validatePaginationParams = (page, pageSize) => {
  const parsedPage = page ? parseInt(page) : null;
  const parsedPageSize = pageSize ? parseInt(pageSize) : null;

  if ((page && isNaN(parsedPage)) || (pageSize && isNaN(parsedPageSize))) {
    return {
      isValid: false,
      error: "分页参数必须是有效的数字",
      page: null,
      pageSize: null,
    };
  }

  return {
    isValid: true,
    error: null,
    page: parsedPage,
    pageSize: parsedPageSize,
  };
};
/**
 * 错误处理函数
 * @param {object} ctx - Koa上下文
 * @param {Error} err - 错误对象
 * @param {string} operation - 操作名称
 */
const handleError = (ctx, err, operation = "操作") => {
  console.error(`${operation}错误:`, err);
  ctx.status = err.status || 500;
  ctx.body = createResponse(false, err.status || 500, `${operation}失败: ${err.message}`);
};
/**
 * 各种操作
 * @param jsonData 原始数据
 * @param operation 操作类型
 * @param newData 新的数据
 * @returns {object} 操作后数据
 */
const handleJson = (jsonData, operation, newData) => {
  let errorInfo = {},
    result = undefined;
  if (typeof newData !== "object") {
    errorInfo = createResponse(false, 400, "需要提供有效的数据对象");
    return errorInfo;
  }
  // 根据操作类型处理
  switch (operation) {
    case "add":
      // 添加新数据
      result = [...jsonData, newData]
      break;

    case "update":
      // 更新现有数据
      jsonData.forEach(v=>{
        if(v[newData.key] === newData.value[newData.key]){
          v = newData.value
        }
      })
      break;

    case "delete":
      // 删除指定键
      result = jsonData.filter((v) => v[newData.key] !== newData.value);
      break;

    case "replace":
      // 完全替换内容
      result = newData;
      break;

    default:
      errorInfo = createResponse(false, 400, "不支持的操作类型");
  }
  result && (errorInfo = createResponse(true, 200, "操作成功", result));
  return errorInfo;
};
module.exports = {
  // 基础工具函数
  createResponse,
  handlePagination,
  validatePaginationParams,
  handleError,
  handleJson
};
