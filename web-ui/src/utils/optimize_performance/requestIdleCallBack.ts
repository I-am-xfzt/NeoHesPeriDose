// 任务接口，用于函数执行
interface Task {
  id: string | number;
  fn: () => void | Promise<void>;
  priority?: number;
}

// 空闲回调调度器的选项配置
interface IdleSchedulerOptions {
  timeout?: number; // 等待空闲回调的最大时间
  maxTasksPerFrame?: number; // 每帧执行的最大任务数
  priority?: boolean; // 是否按优先级排序任务
}

// 默认选项配置
const DEFAULT_OPTIONS: Required<IdleSchedulerOptions> = {
  timeout: 5000,
  maxTasksPerFrame: 5,
  priority: false
};

/**
 * 空闲回调调度器，用于优化函数执行
 * 使用 requestIdleCallback 防止浏览器 UI 阻塞
 */
class IdleCallbackScheduler {
  private taskQueue: Task[] = [];
  private isRunning: boolean = false;
  private options: Required<IdleSchedulerOptions>;

  constructor(options: IdleSchedulerOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * 添加单个任务到队列
   */
  addTask(task: Task): void {
    this.taskQueue.push(task);
    if (this.options.priority) {
      this.sortTasksByPriority();
    }
    this.scheduleExecution();
  }

  /**
   * 添加多个任务到队列
   */
  addTasks(tasks: Task[]): void {
    this.taskQueue.push(...tasks);
    if (this.options.priority) {
      this.sortTasksByPriority();
    }
    this.scheduleExecution();
  }

  /**
   * 清空所有待执行任务
   */
  clearTasks(): void {
    this.taskQueue = [];
  }

  /**
   * 获取待执行任务数量
   */
  getPendingTasksCount(): number {
    return this.taskQueue.length;
  }

  /**
   * 按优先级排序任务（高优先级优先）
   */
  private sortTasksByPriority(): void {
    this.taskQueue.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  /**
   * 使用 requestIdleCallback 调度任务执行
   */
  private scheduleExecution(): void {
    if (this.isRunning || this.taskQueue.length === 0) {
      return;
    }

    this.isRunning = true;

    // 使用 requestIdleCallback，对不支持的浏览器提供回退方案
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(
        (deadline) => this.executeTasksInIdleTime(deadline),
        { timeout: this.options.timeout }
      );
    } else {
      // 对于不支持 requestIdleCallback 的浏览器使用 setTimeout 回退
      setTimeout(() => this.executeTasksWithFallback(), 0);
    }
  }

  /**
   * 在空闲时间执行任务
   */
  private async executeTasksInIdleTime(deadline: IdleDeadline): Promise<void> {
    let tasksExecuted = 0;

    while (
      this.taskQueue.length > 0 &&
      deadline.timeRemaining() > 0 &&
      tasksExecuted < this.options.maxTasksPerFrame
    ) {
      const task = this.taskQueue.shift();
      if (task) {
        try {
          await this.executeTask(task);
          tasksExecuted++;
        } catch (error) {
          console.error(`执行任务 ${task.id} 时出错:`, error);
        }
      }
    }

    this.isRunning = false;

    // 如果还有剩余任务，调度下一次执行
    if (this.taskQueue.length > 0) {
      this.scheduleExecution();
    }
  }

  /**
   * 对于不支持 requestIdleCallback 的浏览器的回退执行方案
   */
  private async executeTasksWithFallback(): Promise<void> {
    let tasksExecuted = 0;
    const startTime = performance.now();

    while (
      this.taskQueue.length > 0 &&
      tasksExecuted < this.options.maxTasksPerFrame &&
      performance.now() - startTime < 16 // 尝试保持在 16ms 帧预算内
    ) {
      const task = this.taskQueue.shift();
      if (task) {
        try {
          await this.executeTask(task);
          tasksExecuted++;
        } catch (error) {
          console.error(`执行任务 ${task.id} 时出错:`, error);
        }
      }
    }

    this.isRunning = false;

    // 如果还有剩余任务，调度下一次执行
    if (this.taskQueue.length > 0) {
      this.scheduleExecution();
    }
  }

  /**
   * 执行单个任务
   */
  private async executeTask(task: Task): Promise<void> {
    const result = task.fn();
    if (result instanceof Promise) {
      await result;
    }
  }
}

/**
 * 工具函数：使用空闲回调优化创建并执行 200 个函数
 */
export function executeOptimizedFunctions(
  functions: (() => void | Promise<void>)[],
  options: IdleSchedulerOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const scheduler = new IdleCallbackScheduler(options);
    
    // 将函数转换为任务
    const tasks: Task[] = functions.map((fn, index) => ({
      id: `task_${index}`,
      fn,
      priority: Math.random() * 10 // 示例用的随机优先级
    }));

    // 跟踪完成情况
    let completedTasks = 0;
    const totalTasks = tasks.length;

    // 包装每个函数以跟踪完成情况
    const wrappedTasks: Task[] = tasks.map(task => ({
      ...task,
      fn: async () => {
        await task.fn();
        completedTasks++;
        
        // 检查是否所有任务都已完成
        if (completedTasks === totalTasks) {
          resolve();
        }
      }
    }));

    // 将所有任务添加到调度器
    scheduler.addTasks(wrappedTasks);
  });
}

/**
 * 示例用法：创建 200 个演示函数用于测试
 */
export function createDemoFunctions(): (() => void)[] {
  const functions: (() => void)[] = [];
  
  for (let i = 0; i < 200; i++) {
    functions.push(() => {
      // 模拟一些工作
      const start = performance.now();
      while (performance.now() - start < Math.random() * 10) {
        // 忙等待模拟计算
      }
    });
  }
  
  return functions;
}

/**
 * 带进度跟踪的示例用法
 */
export function executeWithProgress(
  functions: (() => void | Promise<void>)[],
  onProgress?: (completed: number, total: number) => void,
  options: IdleSchedulerOptions = {}
): Promise<void> {
  return new Promise((resolve) => {
    const scheduler = new IdleCallbackScheduler(options);
    
    let completedTasks = 0;
    const totalTasks = functions.length;

    const tasks: Task[] = functions.map((fn, index) => ({
      id: `task_${index}`,
      fn: async () => {
        await fn();
        completedTasks++;
        
        // 调用进度回调
        if (onProgress) {
          onProgress(completedTasks, totalTasks);
        }
        
        // 检查是否所有任务都已完成
        if (completedTasks === totalTasks) {
          resolve();
        }
      },
      priority: index < 50 ? 10 : 5 // 前 50 个任务优先级更高
    }));

    scheduler.addTasks(tasks);
  });
}

// 导出调度器类供高级用法使用
export { IdleCallbackScheduler };

// 导出类型定义
export type { Task, IdleSchedulerOptions };

/**
 * 简单用法示例：
 * 
 * import { executeOptimizedFunctions, createDemoFunctions } from './requestIdleCallBack';
 * 
 * // 创建 200 个演示函数
 * const functions = createDemoFunctions();
 * 
 * // 使用优化方式执行它们
 * executeOptimizedFunctions(functions, {
 *   maxTasksPerFrame: 5,
 *   timeout: 3000,
 *   priority: true
 * }).then(() => {
 *   console.log('所有 200 个函数执行成功！');
 * });
 */