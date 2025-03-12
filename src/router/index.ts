import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "@/config/nprogress.ts";
import { NextLoading } from "@/utils/loading.ts"
const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			name: 'WindPower',
			redirect: '/WindPower/Production',
			meta: {
				title: '智能风电'
			},
			component: () => import('@/views/WindElectricity/index.vue'),
			children: [
				{
					path: '/WindPower/Production',
					name: 'WindPower/Production',
					meta: {
						title: '风电生产管理'
					},
					component: () => import('@/views/WindElectricity/production/index.vue'),
				},
				{
					path: '/WindPower/OperationAndMaintenance',
					name: 'WindPower/OperationAndMaintenance',
					meta: {
						title: '风电运维管理'
					},
					component: () => import('@/views/WindElectricity/OperationAndMaintenance/index.vue'),
				},
				{
					path: '/WindPower/Device',
					name: 'WindPower/Device',
					meta: {
						title: '风电设备管理'
					},
					component: () => import('@/views/WindElectricity/Device/index.vue'),
				}
			]
		},
		{
			path: '/SmartParkingLot',
			name: 'SmartParkingLot',
			meta: {
				title: '智慧停车场'
			},
			component: () => import('@/views/SmartParkingLot/index.vue')
		}]
})
router.beforeEach((to, from, next) => {
	document.title = `${import.meta.env.VITE_GLOB_APP_TITLE}-${to.meta.title as unknown as string}`
	!window.nextLoading && NextLoading.start();
	NProgress.start()
	next()
})
/**
 * @description 路由跳转错误
 * */
router.onError(error => {
	NProgress.done();
	console.warn("路由错误", error.message);
});

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
	NProgress.done();
});
export default router