import type {ProxyOptions} from "vite";
import { isValidURL } from "../src/utils/toolsValidate"
type ProxyItem = [string, string];

type ProxyList = ProxyItem[];

type ProxyTargetList = Record<string, ProxyOptions>;

/**
 * 创建代理，用于解析 .env.development 代理配置
 * @param list
 */
export function createProxy(list: ProxyList = []) {
    const ret: ProxyTargetList = {}
    for (const [prefix, target] of list) {
        const isHttps = isValidURL(target);

        // https://github.com/http-party/node-http-proxy#options
        ret[prefix] = {
            target: target,
            changeOrigin: true,
            ws: true,
            rewrite: path => path.replace(new RegExp(`^${prefix}`), ""),
            // https is require secure=false
            ...(isHttps ? {secure: false} : {})
        };
    }
    return ret;
}
