import { defineStore } from "pinia";
interface DictState {
  dict: Array<{
    key: string;
    value: Array<SelectOptionType>;
  }>;
}
/**
 * 创建并导出字典存储的 Vue3 stores 对象
 * @function
 * @returns {DictionaryStore} - 返回创建的字典存储对象
 */
export const useDictStore = defineStore("dict", {
  state: (): DictState => ({
    dict: []
  }),
  actions: {
    /**
     * 获取指定键的值
     * @function
     * @param {string} key - 需要获取的键
     * @returns {Object|null} - 返回指定键对应的值，如果找不到则返回 null
     */
    getDict(key: String) {
      try {
        const item = this.dict.find(item => item.key === key);
        return item ? item.value : null;
      } catch (e) {
        return null;
      }
    },

    /**
     * 设置一个键值对
     * @function
     * @param {string} key - 需要设置的键
     * @param {Object} value - 需要设置的值
     */
    setDict(key: string, value: Array<SelectOptionType>) {
      if (!key || typeof key !== "string") {
        return;
      }
      this.dict.push({ key, value });
    },

    /**
     * 删除指定键值对
     * @function
     * @param {string} key - 需要删除的键
     * @returns {boolean} - 返回删除操作是否成功
     */
    removeDict(key: String) {
      try {
        const index = this.dict.findIndex(item => item.key === key);
        if (index !== -1) {
          this.dict.splice(index, 1);
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    }
  }
});
