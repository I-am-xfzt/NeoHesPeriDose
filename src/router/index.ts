import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import NProgress from "@/config/nprogress";
import { staticRouter, errorRouter, baseRouter } from "./modules/staticRouters";
import { NextLoading } from "@/utils/loading";
import { Session } from "@/utils/storage";
import { LOGIN_URL, ROUTER_WHITE_LIST } from "@/config";
import { initControlRoutes } from "./modules/routerController";
import { useAuthStore } from "@/stores/modules/auth";
const routerMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory()
};
const router = createRouter({
  history: routerMode[import.meta.env.VITE_ROUTER_MODE](),
  routes: [...baseRouter, ...staticRouter, ...errorRouter],
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 })
});
router.beforeEach(async (to, from, next) => {
  document.title = `${import.meta.env.VITE_GLOB_APP_TITLE}-${to.meta.title as unknown as string}`;
  NProgress.start();
  const token = Session.getToken();
  if (to.path.toLocaleLowerCase() === LOGIN_URL) {
    if (token) return next(from.fullPath);
    return next();
  }
  // 放行白名单页面
  if (ROUTER_WHITE_LIST.includes(to.path)) return next();
  const authStore = useAuthStore();
  // 刷新页面，或其他原因动态路由清空需重新设置
  if (authStore.authMenuListGet.length === 0) {
    const isNormal = await initControlRoutes();
    if (!isNormal) {
    //   loginOut();
    } else {
      NextLoading.done();
      return next({ ...to, replace: true });
    }
  }
  next();
});
/**
 * @description 路由跳转错误
 * */
router.onError(error => {
  NProgress.done();
  window.nextLoading && NextLoading.done();
  console.warn("路由错误", error.message);
});

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
  NProgress.done();
  window.nextLoading && NextLoading.done();
});
export default router;
