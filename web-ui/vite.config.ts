import { resolve } from "path";
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import { createVitePlugins } from "./build/plugins";
import { wrapperEnv } from "./build/getEnv";
import { createProxy } from "./build/proxy";

const pathResolve = (dir: string) => {
  return resolve(__dirname, ".", dir);
};
const alias: Record<string, string> = {
  "@": pathResolve("./src/"),
  "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
};
const viteConfig = defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  const viteEnv = wrapperEnv(env);
  return {
    plugins: createVitePlugins(viteEnv),
    // esbuild: {
    //   // 可去除打印，但打包速度慢
    //   pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
    // },
    publicDir: "public",
    root: process.cwd(),
    resolve: { alias },
    base: "./",
    server: {
      host: "0.0.0.0",
      port: viteEnv.VITE_PORT as unknown as number,
      open: viteEnv.VITE_OPEN,
      hmr: true,
      proxy: createProxy(viteEnv.VITE_PROXY)
    },
    optimizeDeps: {
      // 开发时 解决这些commonjs包转成esm包
      // include: [],
    },
    build: {
      outDir: env.VITE_DIST_NAME,
      chunkSizeWarningLimit: 1500,
      sourcemap: false, // 关闭 sourcemap 可减少内存
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id.toString().match(/\/node_modules\/(?!.pnpm)(?<moduleName>[^\/]*)\//)?.groups!.moduleName ?? "vender";
            }
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/pxToAdaptUnit.scss" as *;`
        }
      }
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
      __NEXT_NAME__: JSON.stringify(process.env.npm_package_name)
    }
  };
});

export default viteConfig;
