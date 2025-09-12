import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { useMessage, useMessageBox } from "@/hooks/message";
import qs from "qs";
import { Session } from "@/utils/storage";
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
  constructor(baseURL: string, apiName: string = "/base-api") {
    this.instance = axios.create({
      baseURL: apiName + baseURL,
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
      useMessage().error(`请求失败: ${errorMessage}`);
    } else {
      for (const code in this.errorCodeMap) {
        if (response?.status === Number(code)) {
          useMessage().error(this.errorCodeMap[code]);
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
    const { useUserStore } = await import("@/stores/modules/user");
    const { replaceLogin } = await import("@/router/modules/routerController");
    this.clearToken();
    useMessageBox()
      .confirm("登录已过期，请重新登录", {
        showCancelButton: false
      })
      .then(() => useUserStore().loginOut(replaceLogin));
    return Promise.reject(error);
  }
  protected getToken(): string {
    return Session.getToken() as string;
  }

  private clearToken(): void {
    Session.remove("token");
  }

  // 公共请求方法
  public request<T = any>(config: IRequestConfig): Promise<T> {
    return this.instance(config);
  }
  public static async login(params: { username: string; password: string }) {
    const { data } = await axios.post("/login-api/login", params);
    return data;
  }
  public get<T = any>(url: string, params?: any, config?: IRequestConfig): Promise<T> {
    return this.request({ method: "get", url, params, ...config });
  }

  public post<T = any>(url: string, data?: any, config?: IRequestConfig): Promise<T> {
    return this.request({ method: "post", url, data, ...config });
  }

  // 其他HTTP方法...
}
