<template>
	<el-pagination
		@size-change="sizeChangeHandle"
		@current-change="currentChangeHandle"
		class="mt15 s-row-right"
		:pager-count="5"
		:page-sizes="props.pageSizes"
		:current-page="props.current"
		background
		:page-size="props.size"
		:layout="props.layout"
		:total="props.total"
		:prev-icon="arrowl"
		:next-icon="arrowr"
	>
	</el-pagination>
</template>

<script setup lang="ts" name="thePagination">
import arrowl from "./arrowL.vue"
import arrowr from "./arrowR.vue"
const emit = defineEmits(['sizeChange', 'currentChange']);
import { ElPagination } from "element-plus"
const props = defineProps({
	current: {
		type: Number,
		default: 1,
	},
	size: {
		type: Number,
		default: 10,
	},
	total: {
		type: Number,
		default: 0,
	},
	pageSizes: {
		type: Array as () => number[],
		default: () => {
			return [1, 10, 20, 50, 100, 200];
		},
	},
	layout: {
		type: String,
		default: 'total, sizes, prev, pager, next, jumper',
	},
});
// 分页改变
const sizeChangeHandle = (val: number) => {
	emit('sizeChange', val);
};
// 分页改变
const currentChangeHandle = (val: number) => {
	emit('currentChange', val);
};
</script>
