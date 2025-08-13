import {
    ElButton,
    ElInput,
    ElForm,
    ElFormItem,
    ElSelect,
    ElScrollbar,
    ElOption,
    ElPagination,
    ElDatePicker,
    ElAutocomplete,
    ElCascader,
    ElTable,
    ElTableColumn,
    ElConfigProvider,
    ElRow,
    ElCol,
    ElDialog
} from 'element-plus'
// 组件列表
const components = [ElButton, ElDialog, ElInput, ElForm, ElFormItem, ElSelect, ElScrollbar, ElOption, ElPagination, ElDatePicker, ElAutocomplete, ElCascader, ElTable, ElTableColumn, ElConfigProvider, ElRow, ElCol]
export default function (app :any) {
    components.forEach(component => {
        app.component(component.name, component)
    })
}