import autoImport from 'unplugin-auto-import/vite'

export default () => autoImport({
    imports: [
        'vue',
        'vue-router',
        'pinia'
    ],
    dts: false
})
