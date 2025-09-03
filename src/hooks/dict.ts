import { useDictStore } from '@/stores/modules/dict';
import { getDicts } from '@/api/admin/dicts';
import { ref, toRefs } from 'vue';
/**
 * 获取字典数据
 */
export function useDict(...args: any): any {
	const res = ref({});
	return (() => {
		args.forEach((dictType: string) => {
			// @ts-ignore
			res.value[dictType] = [];
			const dicts = useDictStore().getDict(dictType);
			if (dicts) {
				// @ts-ignore
				res.value[dictType] = dicts;
			} else {
				getDicts(dictType).then((resp) => {
					// @ts-ignore
					res.value[dictType] = resp.data.map((p: any) => ({
						label: p.label,
						value: p.value,
						elTagType: p.listClass ?? p.description,
						elTagClass: p.cssClass,
					}));
					// @ts-ignore
					useDictStore().setDict(dictType, res.value[dictType]);
				});
			}
		});
		return toRefs(res.value);
	})();
}
