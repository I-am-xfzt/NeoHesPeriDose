<template>
	<div class="tabs FlexBox">
		<div class="FlexBox" v-for="item in TabsOptions" :key="item.img">
			<img :src="baseUrl + item.img" />
			<div class="tabs-title filterText">
				<span class="YouSheBiaoTiHei hand" @click="$router.push(item.path)">{{ item.title }}</span>
				<p v-if="item.englishTitle">{{ item.englishTitle }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang='ts' name="Tabs">
import options from "./options";
import staticUrl from "@/assets/staticUrl.json"
type kes = keyof typeof options;
interface thePropsType {
	imgKey?: kes
}
console.log(staticUrl);
const props = withDefaults(defineProps<thePropsType>(), {
	imgKey: "windpower",
}), baseUrl: string = staticUrl[props.imgKey],
	TabsOptions = ref(options[props.imgKey]);

</script>

<style lang="scss" scoped>
@use './index.scss';
</style>