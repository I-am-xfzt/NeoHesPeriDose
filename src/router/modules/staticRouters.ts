import {RouteRecordRaw} from "vue-router";

/**
 * staticRouter (静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
    {
        path: '/wind-power/production',
        name: 'WindPower',
        meta: {
            title: '智能风电'
        },
        component: () => import('@/views/WindElectricity/index.vue'),
        children: [
            {
                path: '/wind-power/production',
                name: 'WindPower/Production',
                meta: {
                    title: '风电生产管理'
                },
                component: () => import('@/views/WindElectricity/production/index.vue'),
            },
            {
                path: '/wind-power/operation-and-maintenance',
                name: 'WindPower/operationAndMaintenance',
                meta: {
                    title: '风电运维管理'
                },
                component: () => import('@/views/WindElectricity/OperationAndMaintenance/index.vue'),
            },
            {
                path: '/wind-power/device',
                name: 'WindPower/device',
                meta: {
                    title: '风电设备管理'
                },
                component: () => import('@/views/WindElectricity/Device/index.vue'),
            }
        ]
    },
    {
        path: '/smart-parking-lot',
        name: 'SmartParkingLot',
        meta: {
            title: '智慧停车场'
        },
        component: () => import('@/views/SmartParkingLot/index.vue')
    },
    {
        path: '/fyh-com-demo',
        name: 'FyhComDemo',
        meta: {
            title: '自定义组件demo'
        },
        component: () => import('@/views/demos/fyh-com-demo.vue')
    }
];
/**
 * 基础路由配置
 */
export const baseRouter: RouteRecordRaw[] = [
    {
        path: "/",
        redirect: "/home/index"
    },
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
        redirect: "/home/index",
        children: []
    }
]
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