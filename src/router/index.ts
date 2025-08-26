import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import NProgress from "@/config/nprogress";
import {staticRouter, errorRouter, baseRouter} from "./modules/staticRouters"
import {NextLoading} from "@/utils/loading"

const routerMode = {
    hash: () => createWebHashHistory(),
    history: () => createWebHistory()
}
const router = createRouter({
    history: routerMode[import.meta.env.VITE_ROUTER_MODE](),
    routes: [...baseRouter, ...staticRouter, ...errorRouter],
    strict: false,
    scrollBehavior: () => ({left: 0, top: 0})
})
router.beforeEach((to, from, next) => {
    document.title = `${import.meta.env.VITE_GLOB_APP_TITLE}-${to.meta.title as unknown as string}`
    console.log(from.fullPath)
    !window.nextLoading && NextLoading.start();
    NProgress.start()
    next()
})
/**
 * @description 路由跳转错误
 * */
router.onError(error => {
    NProgress.done();
    window.nextLoading && NextLoading.done()
    console.warn("路由错误", error.message);
});

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
    NProgress.done();
    window.nextLoading && NextLoading.done()
});
export default router