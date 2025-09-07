// WebWorker 任务类型定义
interface WorkerTask {
  id: string | number;
  type: 'EXECUTE_FUNCTION' | 'BATCH_EXECUTE' | 'CALCULATE' | 'PROCESS_DATA';
  payload: any;
  priority?: number;
}

// WebWorker 响应类型定义
interface WorkerResponse {
  id: string | number;
  success: boolean;
  result?: any;
  error?: string;
  progress?: {
    completed: number;
    total: number;
  };
}

// WebWorker 配置选项
interface WebWorkerOptions {
  maxWorkers?: number; // 最大 Worker 数量
  taskBatchSize?: number; // 每批任务数量
  workerTimeout?: number; // Worker 超时时间
  enableProgress?: boolean; // 是否启用进度回调
}

// 默认配置
const DEFAULT_WORKER_OPTIONS: Required<WebWorkerOptions> = {
  maxWorkers: navigator.hardwareConcurrency || 4,
  taskBatchSize: 10,
  workerTimeout: 30000,
  enableProgress: true
};

/**
 * WebWorker 任务管理器
 * 使用多个 WebWorker 来并行执行任务，避免主线程阻塞
 */
class WebWorkerTaskManager {
  private workers: Worker[] = [];
  private taskQueue: WorkerTask[] = [];
  private runningTasks: Map<string | number, { worker: Worker; startTime: number }> = new Map();
  private options: Required<WebWorkerOptions>;
  private workerPromises: Map<string | number, { resolve: Function; reject: Function }> = new Map();

  constructor(options: WebWorkerOptions = {}) {
    this.options = { ...DEFAULT_WORKER_OPTIONS, ...options };
    this.initializeWorkers();
  }

  /**
   * 初始化 WebWorker 池
   */
  private initializeWorkers(): void {
    for (let i = 0; i < this.options.maxWorkers; i++) {
      const worker = this.createWorker();
      this.workers.push(worker);
    }
  }

  /**
   * 创建单个 WebWorker
   */
  private createWorker(): Worker {
    // 创建 Worker 脚本的 Blob URL
    const workerScript = `
      // Worker 内部的函数执行逻辑
      self.onmessage = function(e) {
        const { id, type, payload } = e.data;
        
        try {
          switch (type) {
            case 'EXECUTE_FUNCTION':
              executeFunction(id, payload);
              break;
            case 'BATCH_EXECUTE':
              executeBatchFunctions(id, payload);
              break;
            case 'CALCULATE':
              performCalculation(id, payload);
              break;
            case 'PROCESS_DATA':
              processData(id, payload);
              break;
            default:
              throw new Error('未知的任务类型: ' + type);
          }
        } catch (error) {
          self.postMessage({
            id: id,
            success: false,
            error: error.message || '执行任务时发生错误'
          });
        }
      };

      // 执行单个函数
      function executeFunction(id, payload) {
        const { functionCode, args } = payload;
        
        // 创建函数并执行
        const func = new Function('args', functionCode);
        const result = func(args);
        
        self.postMessage({
          id: id,
          success: true,
          result: result
        });
      }

      // 批量执行函数
      function executeBatchFunctions(id, payload) {
        const { functions, batchSize } = payload;
        const results = [];
        let completed = 0;
        
        for (let i = 0; i < functions.length; i++) {
          try {
            const { functionCode, args } = functions[i];
            const func = new Function('args', functionCode);
            const result = func(args);
            results.push({ index: i, result: result, success: true });
            completed++;
            
            // 发送进度更新
            if (completed % Math.ceil(batchSize / 10) === 0) {
              self.postMessage({
                id: id,
                success: true,
                progress: {
                  completed: completed,
                  total: functions.length
                }
              });
            }
          } catch (error) {
            results.push({ 
              index: i, 
              error: error.message || '执行函数时发生错误', 
              success: false 
            });
            completed++;
          }
        }
        
        // 发送最终结果
        self.postMessage({
          id: id,
          success: true,
          result: results,
          progress: {
            completed: completed,
            total: functions.length
          }
        });
      }

      // 执行数学计算
      function performCalculation(id, payload) {
        const { operation, data } = payload;
        let result;
        
        switch (operation) {
          case 'sum':
            result = data.reduce((acc, val) => acc + val, 0);
            break;
          case 'average':
            result = data.reduce((acc, val) => acc + val, 0) / data.length;
            break;
          case 'factorial':
            result = factorial(data);
            break;
          case 'fibonacci':
            result = fibonacci(data);
            break;
          default:
            throw new Error('不支持的计算操作: ' + operation);
        }
        
        self.postMessage({
          id: id,
          success: true,
          result: result
        });
      }

      // 处理数据
      function processData(id, payload) {
        const { data, operation } = payload;
        let result;
        
        switch (operation) {
          case 'sort':
            result = [...data].sort((a, b) => a - b);
            break;
          case 'filter':
            result = data.filter(item => item > 0);
            break;
          case 'map':
            result = data.map(item => item * 2);
            break;
          case 'transform':
            result = data.map((item, index) => ({
              id: index,
              value: item,
              processed: true
            }));
            break;
          default:
            throw new Error('不支持的数据操作: ' + operation);
        }
        
        self.postMessage({
          id: id,
          success: true,
          result: result
        });
      }

      // 辅助函数：计算阶乘
      function factorial(n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
      }

      // 辅助函数：计算斐波那契数列
      function fibonacci(n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }
    `;

    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    // 设置消息处理器
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      this.handleWorkerMessage(event.data);
    };

    // 设置错误处理器
    worker.onerror = (error) => {
      console.error('WebWorker 错误:', error);
    };

    return worker;
  }

  /**
   * 处理 Worker 返回的消息
   */
  private handleWorkerMessage(response: WorkerResponse): void {
    const { id, success, result, error, progress } = response;
    
    // 更新运行任务状态
    if (this.runningTasks.has(id)) {
      this.runningTasks.delete(id);
    }

    // 获取对应的 Promise
    const promise = this.workerPromises.get(id);
    
    if (promise) {
      if (progress && this.options.enableProgress) {
        // 如果是进度更新且任务未完成，不移除 Promise
        if (progress.completed < progress.total) {
          return;
        }
      }

      // 任务完成，移除 Promise
      this.workerPromises.delete(id);
      
      if (success) {
        promise.resolve(result);
      } else {
        promise.reject(new Error(error || '任务执行失败'));
      }
    }

    // 处理队列中的下一个任务
    this.processNextTask();
  }

  /**
   * 获取可用的 Worker
   */
  private getAvailableWorker(): Worker | null {
    return this.workers.find(worker => 
      !Array.from(this.runningTasks.values()).some(task => task.worker === worker)
    ) || null;
  }

  /**
   * 处理队列中的下一个任务
   */
  private processNextTask(): void {
    if (this.taskQueue.length === 0) return;

    const worker = this.getAvailableWorker();
    if (!worker) return;

    const task = this.taskQueue.shift();
    if (!task) return;

    // 记录运行中的任务
    this.runningTasks.set(task.id, {
      worker: worker,
      startTime: Date.now()
    });

    // 发送任务到 Worker
    worker.postMessage(task);

    // 设置超时处理
    setTimeout(() => {
      if (this.runningTasks.has(task.id)) {
        this.handleTaskTimeout(task.id);
      }
    }, this.options.workerTimeout);
  }

  /**
   * 处理任务超时
   */
  private handleTaskTimeout(taskId: string | number): void {
    const runningTask = this.runningTasks.get(taskId);
    if (runningTask) {
      // 终止超时的任务
      this.runningTasks.delete(taskId);
      
      const promise = this.workerPromises.get(taskId);
      if (promise) {
        this.workerPromises.delete(taskId);
        promise.reject(new Error(`任务 ${taskId} 执行超时`));
      }
    }
  }

  /**
   * 执行单个任务
   */
  executeTask(task: WorkerTask): Promise<any> {
    return new Promise((resolve, reject) => {
      // 存储 Promise 的 resolve 和 reject
      this.workerPromises.set(task.id, { resolve, reject });
      
      // 添加任务到队列
      this.taskQueue.push(task);
      
      // 尝试立即处理任务
      this.processNextTask();
    });
  }

  /**
   * 批量执行函数（优化的 200 个函数执行方案）
   */
  executeFunctions(
    functions: Array<{ code: string; args?: any }>,
    onProgress?: (completed: number, total: number) => void
  ): Promise<any[]> {
    const batchSize = this.options.taskBatchSize;
    const batches: Array<{ code: string; args?: any }[]> = [];
    
    // 将函数分批
    for (let i = 0; i < functions.length; i += batchSize) {
      batches.push(functions.slice(i, i + batchSize));
    }

    // 创建批处理任务
    const batchPromises = batches.map((batch, batchIndex) => {
      const task: WorkerTask = {
        id: `batch_${batchIndex}`,
        type: 'BATCH_EXECUTE',
        payload: {
          functions: batch.map(func => ({
            functionCode: func.code,
            args: func.args
          })),
          batchSize: batchSize
        }
      };

      return this.executeTask(task);
    });

    // 等待所有批次完成
    return Promise.all(batchPromises).then(batchResults => {
      const allResults: any[] = [];
      batchResults.forEach(batchResult => {
        allResults.push(...batchResult);
      });
      
      if (onProgress) {
        onProgress(allResults.length, functions.length);
      }
      
      return allResults;
    });
  }

  /**
   * 销毁所有 Worker
   */
  destroy(): void {
    this.workers.forEach(worker => {
      worker.terminate();
    });
    this.workers = [];
    this.taskQueue = [];
    this.runningTasks.clear();
    this.workerPromises.clear();
  }
}

/**
 * 创建 200 个演示函数用于测试
 */
export function createWebWorkerDemoFunctions(): Array<{ code: string; args?: any }> {
  const functions: Array<{ code: string; args?: any }> = [];
  
  for (let i = 0; i < 200; i++) {
    // 创建不同类型的函数来模拟真实场景
    if (i % 4 === 0) {
      // 数学计算函数
      functions.push({
        code: `
          const { index, base } = args;
          let result = 0;
          for (let j = 0; j < 1000; j++) {
            result += Math.sqrt(base + j);
          }
          console.log('数学计算函数 ' + index + ' 执行完成，结果: ' + result.toFixed(2));
          return { type: 'math', index: index, result: result };
        `,
        args: { index: i, base: i * 10 }
      });
    } else if (i % 4 === 1) {
      // 字符串处理函数
      functions.push({
        code: `
          const { index, text } = args;
          let processed = text.repeat(100).split('').reverse().join('');
          console.log('字符串处理函数 ' + index + ' 执行完成');
          return { type: 'string', index: index, length: processed.length };
        `,
        args: { index: i, text: `测试文本${i}` }
      });
    } else if (i % 4 === 2) {
      // 数组操作函数
      functions.push({
        code: `
          const { index, size } = args;
          const arr = Array.from({ length: size }, (_, i) => i);
          const processed = arr.map(x => x * 2).filter(x => x % 3 === 0).sort((a, b) => b - a);
          console.log('数组操作函数 ' + index + ' 执行完成');
          return { type: 'array', index: index, result: processed.slice(0, 10) };
        `,
        args: { index: i, size: 500 }
      });
    } else {
      // 模拟异步操作函数
      functions.push({
        code: `
          const { index, delay } = args;
          const start = Date.now();
          while (Date.now() - start < delay) {
            // 模拟计算密集型任务
          }
          console.log('异步模拟函数 ' + index + ' 执行完成');
          return { type: 'async', index: index, duration: Date.now() - start };
        `,
        args: { index: i, delay: Math.random() * 50 }
      });
    }
  }
  
  return functions;
}

/**
 * 使用 WebWorker 执行优化后的函数
 */
export async function executeOptimizedFunctionsWithWebWorker(
  functions: Array<{ code: string; args?: any }>,
  options: WebWorkerOptions = {},
  onProgress?: (completed: number, total: number) => void
): Promise<any[]> {
  const manager = new WebWorkerTaskManager(options);
  
  try {
    const results = await manager.executeFunctions(functions, onProgress);
    return results;
  } finally {
    // 确保清理资源
    manager.destroy();
  }
}

/**
 * 单独的计算任务执行器
 */
export async function executeCalculationTask(
  operation: 'sum' | 'average' | 'factorial' | 'fibonacci',
  data: any,
  options: WebWorkerOptions = {}
): Promise<any> {
  const manager = new WebWorkerTaskManager(options);
  
  try {
    const task: WorkerTask = {
      id: `calc_${Date.now()}`,
      type: 'CALCULATE',
      payload: { operation, data }
    };
    
    const result = await manager.executeTask(task);
    return result;
  } finally {
    manager.destroy();
  }
}

/**
 * 数据处理任务执行器
 */
export async function executeDataProcessingTask(
  data: any[],
  operation: 'sort' | 'filter' | 'map' | 'transform',
  options: WebWorkerOptions = {}
): Promise<any> {
  const manager = new WebWorkerTaskManager(options);
  
  try {
    const task: WorkerTask = {
      id: `process_${Date.now()}`,
      type: 'PROCESS_DATA',
      payload: { data, operation }
    };
    
    const result = await manager.executeTask(task);
    return result;
  } finally {
    manager.destroy();
  }
}

// 导出类型定义
export type { WorkerTask, WorkerResponse, WebWorkerOptions };

// 导出管理器类
export { WebWorkerTaskManager };

/**
 * 使用示例：
 * 
 * import { 
 *   executeOptimizedFunctionsWithWebWorker, 
 *   createWebWorkerDemoFunctions 
 * } from './webWorker';
 * 
 * // 创建 200 个演示函数
 * const functions = createWebWorkerDemoFunctions();
 * 
 * // 使用 WebWorker 执行优化
 * executeOptimizedFunctionsWithWebWorker(
 *   functions,
 *   {
 *     maxWorkers: 4,
 *     taskBatchSize: 10,
 *     enableProgress: true
 *   },
 *   (completed, total) => {
 *     console.log(`进度: ${completed}/${total} (${Math.round(completed/total*100)}%)`);
 *   }
 * ).then(results => {
 *   console.log('所有 200 个函数使用 WebWorker 执行完成！', results);
 * }).catch(error => {
 *   console.error('执行过程中出现错误:', error);
 * });
 */