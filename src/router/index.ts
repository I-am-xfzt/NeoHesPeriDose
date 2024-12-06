import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "@/config/nprogress.ts";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/WindElectricity',
			name: 'WindElectricity',
			meta: {
				title: '小米苏7'
			},
			component: () => import('@/views/WindElectricity/index.vue')
		},
		{
			path: '/',
			name: 'SmartParkingLot',
			meta: {
				title: '智慧停车场'
			},
			component: () => import('@/views/SmartParkingLot/index.vue')
		}]
})
router.beforeEach((to, from, next) => {
	document.title = `${import.meta.env.VITE_GLOB_APP_TITLE}-${to.meta.title as unknown as string}`
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