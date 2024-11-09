import { createApp } from 'vue';
import App from './App.vue';
import '@/styles/index.scss';
import DataV from "@jiaminghi/data-view"
import { createStarrySky } from "@/utils/createStarrySky.ts"
// createStarrySky()
createApp(App).use(DataV).mount('#app')
