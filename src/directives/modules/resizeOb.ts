/**
 * @author fyh
 * @description 监听dom尺寸变化指令
 *
 */
import type { Directive, DirectiveBinding } from 'vue'
const theMap = new WeakMap()
const OB = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const handler = theMap.get(entry.target)
    handler && handler(entry)
  }
})
export default {
  mounted(el, binding: DirectiveBinding) {
    OB.observe(el)
    theMap.set(el, binding.value)
  },
  unmounted(el) {
    OB.unobserve(el)
  },
} as Directive
