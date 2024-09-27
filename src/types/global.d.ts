// 申明外部 npm 插件模块
declare module 'js-cookie';
declare module 'qs';
// 声明一个模块，防止引入文件时报错
declare module '*.json';
declare module '*.png';
declare module '*.jpg';
declare module '*.scss';
declare module '*.ts';
declare module '*.js';
declare module '*.mjs';
declare module 'postcss-px-to-viewport';
declare module '@jiaminghi/data-view';
// 声明文件，*.vue 后缀的文件交给 vue 模块来处理
declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

// 声明文件，定义全局变量
/* eslint-disable */
declare interface Window {
	nextLoading: boolean;
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
		isHeader?: Boolean
	};
	component: T
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
};
type StringOrEmpty<T = null> = string | T;
/* Vite */
declare type Recordable<T = any> = Record<string, T>;

declare interface ViteEnv {
	VITE_USER_NODE_ENV: "development" | "production" | "test";
	VITE_GLOB_APP_TITLE: string;
	VITE_PORT: number;
	VITE_OPEN: boolean;
	VITE_REPORT: boolean;
	VITE_ROUTER_MODE: "hash" | "history";
	VITE_BUILD_COMPRESS: "gzip" | "brotli" | "gzip,brotli" | "none";
	VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
	VITE_DROP_CONSOLE: boolean;
	VITE_PWA: boolean;
	VITE_DEVTOOLS: boolean;
	VITE_PUBLIC_PATH: string;
	VITE_API_URL: string;
	VITE_PROXY: [string, string][];
	VITE_CODEINSPECTOR: boolean;
}

interface ImportMetaEnv extends ViteEnv {
	__: unknown;
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