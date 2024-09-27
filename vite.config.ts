import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import postcsspxtoviewport from 'postcss-px-to-viewport'
import { createVitePlugins } from "./build/plugins";
import { wrapperEnv } from "./build/getEnv";
import { createProxy } from "./build/proxy";
const pathResolve = (dir: string) => {
  return resolve(__dirname, '.', dir);
};
const alias: Record<string, string> = {
  '@': pathResolve('./src')
};
const viteConfig = defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());
  const viteEnv = wrapperEnv(env)
  return {
    plugins: createVitePlugins(viteEnv),
    // esbuild: {// 可去除打印，但打包速度慢
    //   pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
    // },
    root: process.cwd(),
    resolve: { alias },
    base: './',
    server: {
      host: '0.0.0.0',
      port: viteEnv.VITE_PORT as unknown as number,
      open: viteEnv.VITE_OPEN,
      hmr: true,
      proxy: createProxy(viteEnv.VITE_PROXY)
    },
    optimizeDeps: {
      // 开发时 解决这些commonjs包转成esm包
      include: [
        "@jiaminghi/c-render",
        "@jiaminghi/c-render/lib/plugin/util",
        "@jiaminghi/charts/lib/util/index",
        "@jiaminghi/charts/lib/util",
        "@jiaminghi/charts/lib/extend/index",
        "@jiaminghi/charts",
        "@jiaminghi/color",
      ],
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().match(/\/node_modules\/(?!.pnpm)(?<moduleName>[^\/]*)\//)?.groups!.moduleName ?? 'vender';
            }
          },
        }
      },
    },
    css: {
      preprocessorOptions: { css: { charset: false } },
      postcss: {
        plugins: [
          postcsspxtoviewport({
            // 要转化的单位
            unitToConvert: 'px',
            // UI设计稿的大小
            viewportWidth: 1920,
            viewportHeight: 1080,
            // 转换后的精度
            unitPrecision: 6,
            // 转换后的单位
            viewportUnit: 'vmin',
            landscapeUnit: 'vmax',
            // 字体转换后的单位
            fontViewportUnit: 'vmax',
            // 能转换的属性，*表示所有属性，!border表示border不转
            propList: ['*'],
            // 最小转换的值，小于等于1不转
            minPixelValue: 1,
            // 是否在媒体查询的css代码中也进行转换，默认false
            mediaQuery: false,
            // 是否转换后直接更换属性值
            replace: true,
            // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
            exclude: [],
            // 包含那些文件或者特定文件
            include: [],
            // 是否处理横屏情况
            landscape: true,
            landscapeWidth: 1920
          }),
        ]
      }
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
      __NEXT_NAME__: JSON.stringify(process.env.npm_package_name)
    }
  };
});

export default viteConfig;
