import { createApp } from 'vue';
import App from './App.vue';
import router from "./router/index"
import '@/styles/index.scss';
import "@/assets/fonts/font.scss";
import getGridScale from "./utils/getGridScale.ts"
import pinia from '@/store/index';
import importCom from "./config/importCom.ts";
// import { createStarrySky } from "@/utils/createStarrySky.ts"
// createStarrySky()
import directives from "@/directives/index.ts";
import 'element-plus/dist/index.css'
import globalVueComponentsImport from "./globalVueComponentsImport"
const app = createApp(App)
getGridScale()
importCom(app)
app.use(router).use(pinia).use(globalVueComponentsImport).use(directives).mount('#app')
