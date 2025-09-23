import { RouteRecordRaw } from "vue-router";
import { HOME_URL, LOGIN_URL } from "@/config"
/**
 * staticRouter (静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
  {
    path: "/workflow",
    name: "workflow",
    component: () => import("@/views/assembly/workflow/index.vue"),
    meta: {
      title: "工作流程图",
      icon: "iconfont icon-flow-chart"
    }
  }
];
/**
 * 基础路由配置
 */
export const baseRouter: RouteRecordRaw[] = [
  {
    path: LOGIN_URL,
    name: "Router.login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录"
    }
  },
  {
    path: "/",
    name: "Router.layout",
    component: () => import("@/layouts/index.vue"),
    redirect: HOME_URL,
    children: []
  }
  ];
/**
 * errorRouter (错误页面路由)
 */
export const errorRouter = [
  {
    path: "/403",
    name: "403",
    component: () => import("@/components/ErrorMessage/403.vue"),
    meta: {
      title: "403页面"
    }
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/components/ErrorMessage/404.vue"),
    meta: {
      title: "404页面"
    }
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/components/ErrorMessage/500.vue"),
    meta: {
      title: "500页面"
    }
  },
  // Resolve refresh page, route warnings
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/components/ErrorMessage/404.vue")
  }
];
