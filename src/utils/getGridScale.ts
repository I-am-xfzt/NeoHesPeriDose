// 根据浏览器大小推断缩放比例
import { nextTick } from "vue";
export default () => {
    nextTick(() => {
        let wh = ~~(window.getComputedStyle(document.getElementById('app') as HTMLElement).height.split('px')[0]);
        let ww = ~~(window.getComputedStyle(document.getElementById('app') as HTMLElement).width.split('px')[0]);
        window.chartScale = 1 + (0.5625 - wh / ww)
    })
};