import router from "../index";
import { useAuthStore } from "@/stores/modules/auth";
import pinia from "@/stores/index";
import { Session } from "@/utils/storage";
import { useUserStore } from "@/stores/modules/user";
import { ElNotification } from "element-plus";
import { NextLoading } from "@/utils/loading";
import { LOGIN_URL } from "@/config";
import { RouteRecordRaw } from "vue-router";
// 前端控制路由
const modules = import.meta.glob("@/views/**/*.vue");
/**
 * 前端控制路由：初始化方法，防止刷新时路由丢失
 * @method  NextLoading 界面 loading 动画开始执行
 * @method useUserStore(pinia).setUserInfos() 触发初始化用户信息 pinia
 * @method setAddRoute 添加动态路由
 * @method setMenuViewRoutes 设置递归过滤有权限的路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 */
export const initControlRoutes = async () => {
  // 界面 loading 动画开始执行
  if (window.nextLoading === undefined) NextLoading.start();
  // 无 token 停止执行下一步
  if (!Session.getToken()) return false;
  // 触发初始化用户信息 pinia
  await useUserStore(pinia).setUserInfo();
  // 无登录权限时，添加判断
  if (useUserStore().userInfo.roles.length <= 0) {
    ElNotification({
      title: "无权限访问",
      message: "当前账号无任何菜单权限，请联系系统管理员！",
      type: "warning",
      duration: 3000
    });
    useUserStore().clearToken();
    useUserStore().clearUserInfo();
    router.replace(LOGIN_URL);
    return Promise.reject("No permission");
  }
  // 设置递归过滤有权限的路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
  await setMenuViewRoutes();
};

/**
 * 获取当前用户权限标识去比对路由表（未处理成多级嵌套路由）
 * @description 这里主要用于动态路由的添加，router.addRoute
 * @link 参考：https://next.router.vuejs.org/zh/api/#addroute
 * @param chil baseRoutes（/@/router/route）第一个顶级 children 的下路由集合
 * @returns 返回有当前用户权限标识的路由数组
 */
export function setFilterRoute(chil: any) {
  const stores = useUserStore(pinia);
  const { userInfo } = storeToRefs(stores);
  let filterRoute: any = [];
  chil.forEach((route: any) => {
    if (route.meta.roles) {
      route.meta.roles.forEach((metaRoles: any) => {
        userInfo.value.roles.forEach((roles: any) => {
          if (metaRoles === roles) filterRoute.push({ ...route });
        });
      });
    }
  });
  return filterRoute;
}

/**
 * @description 用于左侧菜单、横向菜单的显示
 *  添加动态路由
 * @method router.addRoute
 * @link 参考：https://next.router.vuejs.org/zh/api/#addroute
 */
export const setMenuViewRoutes = async () => {
  const authStore = useAuthStore(pinia);
  await authStore.getAuthMenuList();
  await authStore.getAuthButtonList();
  // 3.添加动态路由
  authStore.flatMenuListGet.forEach(item => {
    item.children && delete item.children;
    if (item.component && typeof item.component == "string") {
      item.component = modules["/src/views" + item.component + ".vue"];
    }
    if (item.meta.isFull) {
      router.addRoute(item as unknown as RouteRecordRaw);
    } else {
      router.addRoute("layout", item as unknown as RouteRecordRaw);
    }
  });
};

/**
 * 判断路由 `meta.roles` 中是否包含当前登录用户权限字段
 * @param roles 用户权限标识，在 userInfos（用户信息）的 roles（登录页登录时缓存到浏览器）数组
 * @param route 当前循环时的路由项
 * @returns 返回对比后有权限的路由项
 */
export function hasRoles(roles: any, route: any) {
  if (route.meta && route.meta.roles) return roles.some((role: any) => route.meta.roles.includes(role));
  else return true;
}

/**
 * 获取当前用户权限标识去比对路由表，设置递归过滤有权限的路由
 * @param routes 当前路由 children
 * @param roles 用户权限标识，在 userInfos（用户信息）的 roles（登录页登录时缓存到浏览器）数组
 * @returns 返回有权限的路由数组 `meta.roles` 中控制
 */
export function setFilterHasRolesMenu(routes: any, roles: any) {
  const menu: any = [];
  routes.forEach((route: any) => {
    const item = { ...route };
    if (hasRoles(roles, item)) {
      if (item.children) item.children = setFilterHasRolesMenu(item.children, roles);
      menu.push(item);
    }
  });
  return menu;
}
