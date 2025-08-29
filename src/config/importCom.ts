import type { App } from 'vue'
import {
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElSelect,
  ElScrollbar,
  ElOption,
  ElDatePicker,
  ElAutocomplete,
  ElCascader,
  ElTable,
  ElTableColumn,
  ElConfigProvider,
  ElRow,
  ElCol,
  ElDialog,
  ElAlert,
  ElTabs,
  ElTabPane,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElContainer,
  ElMenu,
  ElMenuItem,
  ElMain,
  ElDropdown,
  ElDropdownItem,
  ElCarouselItem,
  ElCollapse,
  ElCollapseItem,
  ElIcon,
  ElDropdownMenu
} from 'element-plus'
import SvgIcon from '@/components/SvgIcon/index.vue'

const elementComponents = [
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElSelect,
  ElScrollbar,
  ElOption,
  ElDatePicker,
  ElAutocomplete,
  ElCascader,
  ElTable,
  ElTableColumn,
  ElConfigProvider,
  ElRow,
  ElCol,
  ElDialog,
  ElAlert,
  ElTabs,
  ElTabPane,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElContainer,
  ElMenu,
  ElMenuItem,
  ElMain,
  ElDropdown,
  ElDropdownItem,
  ElCarouselItem,
  ElCollapse,
  ElCollapseItem,
  ElIcon,
  ElDropdownMenu,
  SvgIcon
]

export default (app: App) => {
  // 注册Element Plus组件
  elementComponents.forEach((component) => {
      app.component(component.name!, component)
  })
}
