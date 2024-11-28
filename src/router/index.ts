import { createRouter, createWebHashHistory } from "vue-router";
const router = createRouter({
	history: createWebHashHistory(),
	routes: [
	// {
	// 	path: '/unitLogin',
	// 	name: 'unitLogin',
	// 	meta: {
	// 		title: '外部单位登录'
	// 	},
	// 	component: () => import('@/views/login/unitLogin/login.vue')
	// }, 
	{
		path: '/',
		name: 'SmartParkingLot',
		meta: {
			title: '智慧停车场'
		},
			component: () => import('@/views/SmartParkingLot/index.vue'),
		children: []
	}]
})

export default router