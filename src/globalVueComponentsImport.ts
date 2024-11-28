import { App, defineAsyncComponent } from "vue"
import type { DefineComponent } from "vue"
type AsyncComponentLoader = () => Promise<DefineComponent>;
export default {
    install(app: App) {
        const CompositionOptions = import.meta.glob('./views/SmartParkingLot/components/*.vue');
        for (const [key, value] of Object.entries(CompositionOptions)) {
            // 拼接组件注册的 name
            const componentName = key.match(/([^/]+)\.vue$/)![1]
            // 通过 defineAsyncComponent 异步导入指定路径下的组件
            app.component(componentName, defineAsyncComponent(value as AsyncComponentLoader))
        }
    }
}