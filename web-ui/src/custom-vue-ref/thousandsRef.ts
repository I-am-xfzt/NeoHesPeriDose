import { verifyNumberComma } from "@/utils/toolsValidate"
import { customRef, ref } from "vue"

/**
 * 获取带千分位的值
 * @description 返回千分位ref对象
 * @param { String } value
 * @return { customRef } 自定义千分位ref对象
 */
export const getThousandsRef = (value: string) => {
    const state = ref(value)
    return customRef((track, trigger) => {
        return {
            get() {
                track()
                return verifyNumberComma(state.value)
            },
            set(newValue) {
                state.value = newValue
                trigger()
            }
        }
    })
}