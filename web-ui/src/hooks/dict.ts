import { useDictStore } from "@/stores/modules/dict";
import { getDicts } from "@/api/admin/dicts";
import { ref, toRefs, type Ref } from "vue";

/**
 * 获取字典数据
 * @param args 字典类型名称列表
 * @returns 包含各字典数据的响应式对象，键名为字典类型，值为字典选项数组
 */
export function useDict<T extends string[]>(
  ...args: T
): {
  [K in T[number]]: Ref<SelectOptionType[]>;
} {
  const res = ref<EmptyObjectType<SelectOptionType[]>>({});

  return (() => {
    args.forEach(dictType => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts as SelectOptionType[];
      } else {
        getDicts(dictType).then(resp => {
          res.value[dictType] = resp.data.map((p: any) => ({
            label: p.label,
            value: p.value,
            elTagType: p.listClass ?? p.description,
            elTagClass: p.cssClass
          }));
          useDictStore().setDict(dictType, res.value[dictType]);
        });
      }
    });
    return toRefs(res.value) as {
      [K in T[number]]: Ref<SelectOptionType[]>;
    };
  })();
}
