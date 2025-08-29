// src/directives/vLoading.js
import { DirectiveBinding, Directive } from 'vue';
import '@/styles/loading.scss';
export default {
  mounted(el, binding: DirectiveBinding) {
    console.log(binding.value, el, 'mounted');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.setAttribute('class', 'loading-next');
    loadingIndicator.innerHTML = `
      <div class="spin-content">
        <div class="simple-loading-spin">
            <div class="loader"></div>
        </div>
      </div>
    `;
    el.insertBefore(loadingIndicator, el.childNodes[0]);
  },
  updated(el, binding) {
    console.log(binding.value, el);
    !binding.value.loading && setTimeout(() => {
      el && el.removeChild(el.querySelector('.loading-next'));
    }, binding.value.time);
  }
} as Directive;