import { createApp } from 'vue';
import App from './App.vue';
import router from "./router/index"
import '@/styles/index.scss';
import "@/assets/fonts/font.scss";
import getGridScale from "./utils/getGridScale"
import pinia from './stores/index';
// 组件导入
import importCom from "./config/importCom";
import directives from "@/directives/index";
import './styles/element_07ffe5bf.css';
// svg icons
import "virtual:svg-icons-register"
import { viewsSmartParkingLot } from "./globalVueComponentsImport";
// vue i18n
import I18n from "@/config/languages/index";
// tresjs
import Tres from '@tresjs/core'
const app = createApp(App)
getGridScale()
importCom(app)
app.use(router).use(pinia).use(viewsSmartParkingLot).use(directives).use(I18n).use(Tres).mount('#app')
