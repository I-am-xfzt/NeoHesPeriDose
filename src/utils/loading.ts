import {nextTick} from 'vue';

/**
 * 页面全局 Loading
 * @method start 创建 loading
 * @method done 移除 loading
 */
export const NextLoading = {
    // 创建 loading
    start: (size: number = 100) => {
        const bodys: Element = document.body;
        const div = <HTMLElement>document.createElement('div');
        div.setAttribute('class', 'loading-next');
        div.innerHTML = `
                <svg width="${size}px" height="${size}px">
                    <circle cx="${size / 2}" cy="${size / 2}" r="30" fill="transparent" stroke-width="3" stroke-dasharray="31.415, 31.415" stroke="#02bcfe" stroke-linecap="round">
                        <animateTransform attributeName="transform" type="rotate" values="0, ${size / 2} ${size / 2};360, ${size / 2} ${size / 2}" dur="1.5s" repeatCount="indefinite"></animateTransform>
                        <animate attributeName="stroke" values="#02bcfe;#3be6cb;#02bcfe" dur="3s" repeatCount="indefinite"></animate>
                    </circle>
                    <circle cx="${size / 2}" cy="${size / 2}" r="15" fill="transparent" stroke-width="3" stroke-dasharray="15.7, 15.7" stroke="#3be6cb" stroke-linecap="round">
                        <animateTransform attributeName="transform" type="rotate" values="360, ${size / 2} ${size / 2};0, ${size / 2} ${size / 2}" dur="1.5s" repeatCount="indefinite"></animateTransform> 
                        <animate attributeName="stroke" values="#3be6cb;#02bcfe;#3be6cb" dur="3s" repeatCount="indefinite"></animate>
                    </circle>
                </svg>
		`;
        bodys.insertBefore(div, bodys.childNodes[0]);
        window.nextLoading = true;
    },
    // 移除 loading
    done: async (time: number = 0) => {
        await nextTick(() => {
            setTimeout(() => {
                window.nextLoading = false;
                const el = <HTMLElement>document.querySelector('.loading-next');
                el?.parentNode?.removeChild(el);
            }, time);
        });
    },
};