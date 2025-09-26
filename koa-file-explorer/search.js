// ================== 数据搜索方法 ==================

/**
 * 通用文本搜索函数
 * @param {Array} data - 要搜索的数据数组
 * @param {string} searchText - 搜索文本
 * @param {Array} searchFields - 要搜索的字段数组，为空则搜索所有字段
 * @param {boolean} caseSensitive - 是否区分大小写，默认false
 * @returns {Array} 搜索结果
 * @example 
 ```
// Use the search methods
const results = searchData(data, 'searchTerm', ['name', 'email']);
const filtered = exactSearch(data, 'status', 'active');
const sorted = sortData(data, 'created_at', 'desc');
```
 */
const searchData = (data, searchText, searchFields = [], caseSensitive = false) => {
  if (!Array.isArray(data) || !searchText || searchText.trim() === '') {
    return data;
  }

  const searchTerm = caseSensitive ? searchText.trim() : searchText.trim().toLowerCase();
  
  return data.filter(item => {
    // 如果指定了搜索字段，只在这些字段中搜索
    if (searchFields.length > 0) {
      return searchFields.some(field => {
        const fieldValue = getNestedValue(item, field);
        if (fieldValue === null || fieldValue === undefined) return false;
        const valueStr = caseSensitive ? String(fieldValue) : String(fieldValue).toLowerCase();
        return valueStr.includes(searchTerm);
      });
    }
    
    // 否则在所有字段中搜索
    return searchInAllFields(item, searchTerm, caseSensitive);
  });
};

/**
 * 精确匹配搜索
 * @param {Array} data - 要搜索的数据数组
 * @param {string} field - 搜索字段
 * @param {any} value - 搜索值
 * @returns {Array} 搜索结果
 */
const exactSearch = (data, field, value) => {
  if (!Array.isArray(data) || !field) {
    return data;
  }
  
  return data.filter(item => {
    const fieldValue = getNestedValue(item, field);
    return fieldValue === value;
  });
};

/**
 * 范围搜索（适用于数字和日期）
 * @param {Array} data - 要搜索的数据数组
 * @param {string} field - 搜索字段
 * @param {any} minValue - 最小值
 * @param {any} maxValue - 最大值
 * @returns {Array} 搜索结果
 */
const rangeSearch = (data, field, minValue, maxValue) => {
  if (!Array.isArray(data) || !field) {
    return data;
  }
  
  return data.filter(item => {
    const fieldValue = getNestedValue(item, field);
    if (fieldValue === null || fieldValue === undefined) return false;
    
    const numValue = Number(fieldValue);
    if (isNaN(numValue)) return false;
    
    const min = minValue !== null && minValue !== undefined ? Number(minValue) : -Infinity;
    const max = maxValue !== null && maxValue !== undefined ? Number(maxValue) : Infinity;
    
    return numValue >= min && numValue <= max;
  });
};

/**
 * 模糊搜索（使用正则表达式）
 * @param {Array} data - 要搜索的数据数组
 * @param {string} pattern - 正则表达式模式
 * @param {Array} searchFields - 要搜索的字段数组
 * @param {string} flags - 正则表达式标志，默认'gi'
 * @returns {Array} 搜索结果
 */
const fuzzySearch = (data, pattern, searchFields = [], flags = 'gi') => {
  if (!Array.isArray(data) || !pattern) {
    return data;
  }
  
  try {
    const regex = new RegExp(pattern, flags);
    
    return data.filter(item => {
      if (searchFields.length > 0) {
        return searchFields.some(field => {
          const fieldValue = getNestedValue(item, field);
          if (fieldValue === null || fieldValue === undefined) return false;
          return regex.test(String(fieldValue));
        });
      }
      
      return searchInAllFieldsRegex(item, regex);
    });
  } catch (error) {
    console.error('Fuzzy search regex error:', error);
    return data;
  }
};

/**
 * 多条件搜索
 * @param {Array} data - 要搜索的数据数组
 * @param {Array} conditions - 搜索条件数组
 * @param {string} operator - 逻辑操作符 'AND' 或 'OR'，默认'AND'
 * @returns {Array} 搜索结果
 */
const multiConditionSearch = (data, conditions, operator = 'AND') => {
  if (!Array.isArray(data) || !Array.isArray(conditions) || conditions.length === 0) {
    return data;
  }
  
  return data.filter(item => {
    const results = conditions.map(condition => {
      const { field, value, type = 'contains', caseSensitive = false } = condition;
      
      switch (type) {
        case 'exact':
          return exactMatch(item, field, value);
        case 'contains':
          return containsMatch(item, field, value, caseSensitive);
        case 'startsWith':
          return startsWithMatch(item, field, value, caseSensitive);
        case 'endsWith':
          return endsWithMatch(item, field, value, caseSensitive);
        case 'range':
          return rangeMatch(item, field, value.min, value.max);
        case 'regex':
          return regexMatch(item, field, value);
        default:
          return containsMatch(item, field, value, caseSensitive);
      }
    });
    
    return operator.toLowerCase() === 'or' 
      ? results.some(result => result)
      : results.every(result => result);
  });
};

/**
 * 排序函数
 * @param {Array} data - 要排序的数据数组
 * @param {string} field - 排序字段
 * @param {string} order - 排序顺序 'asc' 或 'desc'，默认'asc'
 * @returns {Array} 排序后的数据
 */
const sortData = (data, field, order = 'asc') => {
  if (!Array.isArray(data) || !field) {
    return data;
  }
  
  return [...data].sort((a, b) => {
    const valueA = getNestedValue(a, field);
    const valueB = getNestedValue(b, field);
    
    // 处理null/undefined值
    if (valueA === null || valueA === undefined) return 1;
    if (valueB === null || valueB === undefined) return -1;
    
    // 尝试数字比较
    const numA = Number(valueA);
    const numB = Number(valueB);
    
    if (!isNaN(numA) && !isNaN(numB)) {
      return order === 'desc' ? numB - numA : numA - numB;
    }
    
    // 字符串比较
    const strA = String(valueA).toLowerCase();
    const strB = String(valueB).toLowerCase();
    
    if (order === 'desc') {
      return strB.localeCompare(strA);
    }
    return strA.localeCompare(strB);
  });
};

/**
 * 分组函数
 * @param {Array} data - 要分组的数据数组
 * @param {string} field - 分组字段
 * @returns {Object} 分组结果
 */
const groupData = (data, field) => {
  if (!Array.isArray(data) || !field) {
    return {};
  }
  
  return data.reduce((groups, item) => {
    const value = getNestedValue(item, field);
    const key = value !== null && value !== undefined ? String(value) : 'undefined';
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    
    return groups;
  }, {});
};

/**
 * 过滤唯一值
 * @param {Array} data - 要处理的数据数组
 * @param {string} field - 用于判断唯一性的字段
 * @returns {Array} 去重后的数据
 */
const uniqueData = (data, field) => {
  if (!Array.isArray(data) || !field) {
    return data;
  }
  
  const seen = new Set();
  return data.filter(item => {
    const value = getNestedValue(item, field);
    const key = JSON.stringify(value);
    
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// ================== 辅助函数 ==================

/**
 * 获取嵌套对象的值
 * @param {Object} obj - 对象
 * @param {string} path - 属性路径，支持点号分割
 * @returns {any} 属性值
 */
const getNestedValue = (obj, path) => {
  if (!obj || !path) return null;
  
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

/**
 * 在对象的所有字段中搜索文本
 * @param {Object} obj - 要搜索的对象
 * @param {string} searchTerm - 搜索词
 * @param {boolean} caseSensitive - 是否区分大小写
 * @returns {boolean} 是否找到匹配项
 */
const searchInAllFields = (obj, searchTerm, caseSensitive = false) => {
  if (typeof obj !== 'object' || obj === null) {
    const valueStr = caseSensitive ? String(obj) : String(obj).toLowerCase();
    return valueStr.includes(searchTerm);
  }
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (searchInAllFields(obj[key], searchTerm, caseSensitive)) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * 使用正则表达式在所有字段中搜索
 * @param {Object} obj - 要搜索的对象
 * @param {RegExp} regex - 正则表达式
 * @returns {boolean} 是否找到匹配项
 */
const searchInAllFieldsRegex = (obj, regex) => {
  if (typeof obj !== 'object' || obj === null) {
    return regex.test(String(obj));
  }
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (searchInAllFieldsRegex(obj[key], regex)) {
        return true;
      }
    }
  }
  
  return false;
};

// 匹配函数
const exactMatch = (item, field, value) => {
  const fieldValue = getNestedValue(item, field);
  return fieldValue === value;
};

const containsMatch = (item, field, value, caseSensitive = false) => {
  const fieldValue = getNestedValue(item, field);
  if (fieldValue === null || fieldValue === undefined) return false;
  
  const fieldStr = caseSensitive ? String(fieldValue) : String(fieldValue).toLowerCase();
  const valueStr = caseSensitive ? String(value) : String(value).toLowerCase();
  
  return fieldStr.includes(valueStr);
};

const startsWithMatch = (item, field, value, caseSensitive = false) => {
  const fieldValue = getNestedValue(item, field);
  if (fieldValue === null || fieldValue === undefined) return false;
  
  const fieldStr = caseSensitive ? String(fieldValue) : String(fieldValue).toLowerCase();
  const valueStr = caseSensitive ? String(value) : String(value).toLowerCase();
  
  return fieldStr.startsWith(valueStr);
};

const endsWithMatch = (item, field, value, caseSensitive = false) => {
  const fieldValue = getNestedValue(item, field);
  if (fieldValue === null || fieldValue === undefined) return false;
  
  const fieldStr = caseSensitive ? String(fieldValue) : String(fieldValue).toLowerCase();
  const valueStr = caseSensitive ? String(value) : String(value).toLowerCase();
  
  return fieldStr.endsWith(valueStr);
};

const rangeMatch = (item, field, minValue, maxValue) => {
  const fieldValue = getNestedValue(item, field);
  if (fieldValue === null || fieldValue === undefined) return false;
  
  const numValue = Number(fieldValue);
  if (isNaN(numValue)) return false;
  
  const min = minValue !== null && minValue !== undefined ? Number(minValue) : -Infinity;
  const max = maxValue !== null && maxValue !== undefined ? Number(maxValue) : Infinity;
  
  return numValue >= min && numValue <= max;
};

const regexMatch = (item, field, pattern) => {
  const fieldValue = getNestedValue(item, field);
  if (fieldValue === null || fieldValue === undefined) return false;
  
  try {
    const regex = new RegExp(pattern, 'gi');
    return regex.test(String(fieldValue));
  } catch (error) {
    console.error('Regex match error:', error);
    return false;
  }
};

// ================== 导出模块 ==================

module.exports = {
  // 核心搜索函数
  searchData,
  exactSearch,
  rangeSearch,
  fuzzySearch,
  multiConditionSearch,
  
  // 数据操作函数
  sortData,
  groupData,
  uniqueData,
  
  // 辅助函数
  getNestedValue
};