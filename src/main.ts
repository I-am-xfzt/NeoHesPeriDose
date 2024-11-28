import { createApp } from 'vue';
import App from './App.vue';
import router from "./router/index"
import '@/styles/index.scss';
import "@/assets/fonts/font.scss";
import getGridScale from "./utils/getGridScale.ts"
// import { createStarrySky } from "@/utils/createStarrySky.ts"
// createStarrySky()
import 'element-plus/dist/index.css'
import globalVueComponentsImport from "./globalVueComponentsImport"
const app = createApp(App)
getGridScale()
app.use(router).use(globalVueComponentsImport).mount('#app')
