// 申明外部 npm 插件模块
declare module "js-cookie";
declare module "qs";
// 声明一个模块，防止引入文件时报错
declare module "*.json";
declare module "*.png";
declare module "*.jpg";
declare module "*.scss";
declare module "*.ts";
declare module "*.js";
declare module "*.mjs";
declare module "qrcodejs2-fixes";
// 声明文件，*.vue 后缀的文件交给 vue 模块来处理
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 声明文件，定义全局变量
/* eslint-disable */
declare interface Window {
  chartScale: number;
  echartsPortrait: boolean;
  nextLoading: boolean;
  _AMapSecurityConfig: {
    securityJsCode: string
  }
}

// 声明路由当前项类型
declare type RouteItem<T = any> = {
  path: string;
  name?: string | symbol | undefined | null;
  redirect?: string;
  k?: T;
  meta?: {
    title?: string;
    roles?: string[];
    isLink?: string;
    isHeader?: Boolean;
  };
  component: T;
  children?: T[];
  query?: { [key: string]: T };
  params?: { [key: string]: T };
  contextMenuClickId?: string | number;
  commonUrl?: string;
  isFnClick?: boolean;
  url?: string;
  transUrl?: string;
  title?: string;
  id?: string | number;
};

// 声明路由 to from
declare interface RouteToFrom<T = any> extends RouteItem {
  path?: string;
  children?: T[];
}

// 声明路由当前项类型集合
declare type RouteItems<T extends RouteItem = any> = T[];

// 声明 ref
declare type RefType<T = any> = T | null;

// 声明 HTMLElement
declare type HtmlType = HTMLElement | string | undefined | null;

// 申明 children 可选
declare type ChilType<T = any> = {
  children?: T[];
};

// 申明 数组
declare type EmptyArrayType<T = any> = T[];

// 申明 对象
declare type EmptyObjectType<T = any> = {
  [key: string]: T;
};

// 申明 select option
declare type SelectOptionType = {
  value: string | number;
  label: string | number;
  [k: string]: any;
};
type StringOrEmpty<T = null> = string | T;

/* __APP_INFO__ */
declare const __APP_INFO__: {
  pkg: {
    name: string;
    version: string;
    dependencies: Recordable<string>;
    devDependencies: Recordable<string>;
  };
  lastBuildTime: string;
};
/* Menu */
declare namespace Menu {
  interface MenuOptions {
    path: string;
    name: string;
    component?: string | (() => Promise<unknown>);
    redirect?: string;
    meta: MetaProps;
    children?: MenuOptions[];
  }
  interface MetaProps {
    icon: string;
    title: string;
    activeMenu?: string;
    isLink?: string;
    isHide: boolean;
    isFull: boolean;
    isAffix: boolean;
    roles?: string[];
    isKeepAlive: boolean;
  }
}

/* FileType */
declare namespace File {
  type ImageMimeType =
    | "image/apng"
    | "image/bmp"
    | "image/gif"
    | "image/jpeg"
    | "image/pjpeg"
    | "image/png"
    | "image/svg+xml"
    | "image/tiff"
    | "image/webp"
    | "image/x-icon";

  type ExcelMimeType = "application/vnd.ms-excel" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
}

/* Vite */
declare type Recordable<T = any> = Record<string, T>;

declare interface ViteEnv {
  VITE_USER_NODE_ENV: "development" | "valley" | "test";
  readonly VITE_GLOB_APP_TITLE: string;
  readonly VITE_PORT: number;
  readonly VITE_OPEN: boolean;
  readonly VITE_REPORT: boolean;
  readonly VITE_ROUTER_MODE: "hash" | "history";
  readonly VITE_BUILD_COMPRESS: "gzip" | "brotli" | "gzip,brotli" | "none";
  readonly VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
  readonly VITE_DROP_CONSOLE: boolean;
  readonly VITE_PWA: boolean;
  readonly VITE_DEVTOOLS: boolean;
  readonly VITE_PUBLIC_PATH: string;
  readonly VITE_PROXY: [string, string][];
  readonly VITE_SYS_AMAP_KEY: string;
  readonly VITE_SYS_AMAP_CODE: string;
}
// 鼠标滚轮滚动类型
declare interface WheelEventType extends WheelEvent {
  wheelDelta: number;
}
interface ImportMetaEnv extends ViteEnv {
  __: unknown;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob: (pattern: string) => Record<string, () => Promise<unknown>>;
  globEager?: (pattern: string) => Record<string, unknown>;
}
/* __APP_INFO__ */
declare const __APP_INFO__: {
  pkg: {
    name: string;
    version: string;
    dependencies: Recordable<string>;
    devDependencies: Recordable<string>;
  };
  lastBuildTime: string;
};

declare interface HttpResType<T = any> {
  code: number;
  data: T;
  msg: string;
  [key: string]: any; // 兼容其他返回数据格式，如：dat
}
declare interface listResponse<T> {
  total: number;
  size: number;
  current: number;
  pages: number;
  records: T[]
}

declare type themeType = 'info' | 'success' | 'warning' | 'danger' | 'primary' | 'default';
