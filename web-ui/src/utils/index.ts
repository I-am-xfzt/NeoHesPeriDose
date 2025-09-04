/**
 * 加载模块
 * @function loadModule
 * @returns {Promise<any>} 返回一个 Promise，解析为加载的模块
 * @description 动态加载指定路径的模块。使用 Vite 的动态导入功能。
 * @example
 * import { loadModule } from 'src/utils/index';
 * loadModule().then(module => {
 *   // 使用加载的模块
 * });
 */
export const loadModule = async <T = any>(path: string, name: string = "formOptions.ts"): Promise<T> => {
  return await import(/* @vite-ignore */ `../${path}/${name}`);
};

/**
 * @description 获取浏览器默认语言
 * @returns {String}
 */
export const getBrowserLang = () => {
  // 使用现代的语言检测方法，优先使用 navigator.language，然后是 navigator.languages[0]
  let browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || "en";
  let defaultBrowserLang = "";
  if (["cn", "zh", "zh-cn"].includes(browserLang.toLowerCase())) {
    defaultBrowserLang = "zh";
  } else {
    defaultBrowserLang = "en";
  }
  return defaultBrowserLang;
};
