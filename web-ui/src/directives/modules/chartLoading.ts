// src/directives/vLoading.js
import {DirectiveBinding, Directive} from 'vue';
import '@/styles/loading.scss';

export default {
    mounted(el, binding: DirectiveBinding) {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.setAttribute('class', 'loading-next posCenter');
        loadingIndicator.innerHTML = `
      <div class="spin-content">
        <div class="simple-loading-spin">
            <div class="loader"></div>
        </div>
      </div>
    `;
        el.insertBefore(loadingIndicator, el.childNodes[0]);
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
        }, binding.value.time);
    },
    updated(el, binding) {
        setTimeout(() => {
            if (el) {
                const dom = el.querySelector('.loading-next');
                dom && (dom.style.display = !binding.value.loading ? 'none' : 'flex')
            }
        }, binding.value.time);
    }
} as Directive;