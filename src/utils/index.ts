/**
 * Utility functions for the project
 * @module utils
 * @version 1.0.0
 * @author 范永豪
 * @license MIT
 * @description This module provides utility functions for dynamic module loading and other common tasks.
 * @see {@link https://example.com} for more information.
 * @example
 * import { loadModule } from 'src/utils/index';
 * loadModule().then(module => {
 *   // Use the loaded module
 * });
 */

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
/**
 * Asynchronously loads a module from the specified path.
 * The function constructs the full path to the 'formOptions.ts' file relative to the given path and dynamically imports it.
 *
 * @param {string} path - The directory path, relative to the current file, where the 'formOptions.ts' is located.
 * @returns {Promise<any>} A promise that resolves to the loaded module.
 */
export const loadModule = async <T = any>(path: string): Promise<T> => {
 return await import(/* @vite-ignore */ `../${path}/formOptions.ts`);
}
