import autoImport from 'unplugin-auto-import/vite'

export default () => autoImport({
    imports: [
        'vue',
        'vue-router',
        'pinia'
    ],
    include: [/\.vue$/, /\.vue\?vue/],
    eslintrc: {
        enabled: false,
        filepath: '../.eslintrc-auto-import.json',
        globalsPropValue: true
    }
})
