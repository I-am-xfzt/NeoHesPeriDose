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
  // ElTable,
  ElTag,
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
  ElCard
} from 'element-plus'
import SvgIcon from '@/components/SvgIcon/index.vue'
import thePagination from "@/components/Pagination/index.vue"
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
  ElCard,
  ElTag,
  ElTableColumn,
  ElConfigProvider,
  ElRow,
  ElCol,
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
  SvgIcon,
  thePagination
]

export default (app: App) => {
  // 注册Element Plus组件
  elementComponents.forEach((component) => {
      app.component(component.name!, component)
  })
}
