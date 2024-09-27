import { createApp } from 'vue';
import App from './App.vue';
import '@/styles/index.scss';
import DataV from "@jiaminghi/data-view"
createApp(App).use(DataV).mount('#app')
