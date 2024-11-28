import { verifyNumberComma } from "./toolsValidate"
import { customRef, ref } from "vue"
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