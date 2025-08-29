import { RouteRecordRaw } from "vue-router";

/**
 * staticRouter (静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home/index",
    meta: {
      title: "首页"
    }
  },
  {
    path: "/system",
    name: "Router.System",
    meta: {
      title: "系统管理"
    },
    redirect: "/wind-power"
  },
  {
    path: "/three",
    name: "Router.Three",
    meta: {
      title: "THREE"
    },
    redirect: "/wind-power"
  },
  {
    path: "/babylon",
    name: "Router.BABYLON",
    meta: {
      title: "BABYLON"
    },
    redirect: ""
  }
];
/**
 * 基础路由配置
 */
export const baseRouter: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Router.login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录"
    }
  },
  {
    path: "/layout",
    name: "Router.layout",
    component: () => import("@/layouts/index.vue"),
    // redirect: "/home/index",
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
