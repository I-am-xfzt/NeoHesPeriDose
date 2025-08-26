import type { App } from 'vue'
import * as ElementPlus from 'element-plus'
import SvgIcon from '@/components/SvgIcon/index.vue'

const elementComponents = [
  'ElButton',
  'ElInput',
  'ElForm',
  'ElFormItem',
  'ElSelect',
  'ElScrollbar',
  'ElOption',
  'ElDatePicker',
  'ElAutocomplete',
  'ElCascader',
  'ElTable',
  'ElTableColumn',
  'ElConfigProvider',
  'ElRow',
  'ElCol',
  'ElDialog',
  'ElAlert',
  'ElTabs',
  'ElTabPane',
  'ElBreadcrumb',
  'ElBreadcrumbItem',
  'ElContainer',
  'ElMenu',
  'ElMenuItem',
  'ElMain',
  'ElDropdown',
  'ElDropdownItem',
  'ElCarouselItem',
  'ElCollapse',
  'ElCollapseItem',
]

export default (app: App) => {
  // 注册Element Plus组件
  elementComponents.forEach((name) => {
    const component = ElementPlus[name]
    if (component) {
      app.component(name, component)
    }
  })
  // 注册自定义组件
  app.component('SvgIcon', SvgIcon)
}
