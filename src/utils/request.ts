import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { ElMessage } from "element-plus"; // 以antd为例，可按需替换提示组件
import qs from "qs";
import { wrapperEnv } from "../../build/getEnv";
import { generateUUID } from "@/utils/other";
import { Session } from "@/utils/storage";
const { VITE_PROXY } = wrapperEnv(import.meta.env);
// 基础类型定义
interface IRequestConfig extends AxiosRequestConfig {
  autoTokenRefresh?: boolean; // 是否自动刷新token
  serializeParams?: boolean; // 是否序列化GET参数
}

interface IErrorResponse {
  code: number;
  message: string;
  msg: string;
}
enum CommonHeaderEnum {
  Authorization = "Authorization"
}

// 基础请求类
export class BaseHttpClient {
  protected readonly instance: AxiosInstance;
  private tokenRefreshPromise: Promise<string> | null = null;
  private readonly errorCodeMap: Record<number, string> = {
    400: "请求错误",
    401: "未授权，请登录",
    403: "拒绝访问",
    404: "请求地址出错",
    500: "服务器内部错误",
    502: "网关错误",
    503: "服务不可用",
    504: "网关超时"
  };
  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL: baseURL,
      timeout: 15000,
      paramsSerializer: {
        serialize: params => qs.stringify(params, { arrayFormat: "repeat" })
      }
    });
    this.initInterceptors();
  }

  // 初始化拦截器
  private initInterceptors() {
    // 请求拦截
    this.instance.interceptors.request.use(
      config => this.handleRequest(config),
      error => Promise.reject(error)
    );

    // 响应拦截
    this.instance.interceptors.response.use(
      response => this.handleResponse(response),
      error => this.handleError(error)
    );
  }

  // 处理请求
  private async handleRequest(config: IRequestConfig): Promise<any> {
    // 序列化GET参数
    if (config.serializeParams !== false && config.method?.toLowerCase() === "get") {
      config.paramsSerializer = params => {
        return Object.keys(params)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
          .join("&");
      };
    }

    // 添加鉴权token
    const token = this.getToken();
    if (token && !config.headers?.Authorization) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }

    return config;
  }

  // 处理响应
  private handleResponse(response: AxiosResponse): any {
    return response.data;
  }

  // 处理错误
  private async handleError(error: AxiosError<IErrorResponse>): Promise<any> {
    const { config, response } = error;
    const requestConfig = config as IRequestConfig,
      errorMessage = response?.data?.message || response?.data?.msg || error.message;
    if (errorMessage) {
      ElMessage.error(`请求失败: ${errorMessage}`);
    } else {
      for (const code in this.errorCodeMap) {
        if (response?.status === Number(code)) {
          ElMessage.error(this.errorCodeMap[code]);
          break;
        }
      }
    }
    // 鉴权过期处理 (401)
    if (response?.status === 401 && requestConfig.autoTokenRefresh !== false) {
      return this.handleTokenExpired(error);
    }

    return Promise.reject(error);
  }

  // 处理token过期
  private async handleTokenExpired(error: AxiosError): Promise<any> {
    if (!this.tokenRefreshPromise) {
      this.tokenRefreshPromise = this.refreshToken().finally(() => {
        this.tokenRefreshPromise = null;
      });
    }

    try {
      const newToken = await this.tokenRefreshPromise;
      const originalRequest = error.config!;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return this.instance(originalRequest);
    } catch (refreshError) {
      this.clearToken();
      ElMessage.error("登录已过期，请重新登录");
      // 这里可以跳转到登录页
      return Promise.reject(error);
    }
  }
  protected getToken(): string {
    return Session.getToken() as string;
  }
  protected async refreshToken(): Promise<string> {
    const response = await this.post<{ token: string }>("/auth/refresh");
    localStorage.setItem("auth_token", response.token);
    return response.token;
  }
  private clearToken(): void {
    // 子类需要实现清除token的逻辑
  }

  // 公共请求方法
  public request<T = any>(config: IRequestConfig): Promise<T> {
    return this.instance(config);
  }
  public static login() {
    const token = generateUUID();
    Session.set('token', token)
    return Promise.resolve({
      code: 200,
      data: {
        token
      }
    });
  }
  public get<T = any>(url: string, params?: any, config?: IRequestConfig): Promise<T> {
    return this.request({ method: "get", url, params, ...config });
  }

  public post<T = any>(url: string, data?: any, config?: IRequestConfig): Promise<T> {
    return this.request({ method: "post", url, data, ...config });
  }

  // 其他HTTP方法...
}

// 业务子模块示例 - 用户模块
class UserApi extends BaseHttpClient {
  constructor() {
    super("/user");
  }

  public getUserInfo(userId: string) {
    return this.get<{ user: any }>(`/${userId}`);
  }
}

// 业务子模块示例 - 订单模块
class OrderApi extends BaseHttpClient {
  constructor(baseURL: string) {
    super(baseURL);
  }

  protected async refreshToken(): Promise<string> {
    const response = await this.post<{ token: string }>("/auth/refresh");
    localStorage.setItem("auth_token", response.token);
    return response.token;
  }

  // 业务方法
  public createOrder(orderData: any) {
    return this.post<{ orderId: string }>("/orders", orderData);
  }

  public getOrderList(params: { page: number; size: number }) {
    return this.get<{ list: any[] }>("/orders", params);
  }
}

// 使用示例
const API_BASE = "https://api.example.com";

// 初始化各业务模块
export const userApi = new UserApi();
export const orderApi = new OrderApi(API_BASE);

// 在组件中使用
async function fetchData() {
  try {
    const user = await userApi.getUserInfo("123");
    const orders = await orderApi.getOrderList({ page: 1, size: 10 });
  } catch (error) {
    console.error("请求失败", error);
  }
}
