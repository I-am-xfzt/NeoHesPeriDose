
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
export const loadModule = async <T = any>(path: string): Promise<T> => {
 return await import(/* @vite-ignore */ `../${path}/formOptions.ts`);
}
