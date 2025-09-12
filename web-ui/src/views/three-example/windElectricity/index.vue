<template>
	<div class="app-container wh100">
		<router-view></router-view>
		<WindPowerTabs class="windpower" />
	</div>
</template>
<script setup lang='ts'>
import WindPowerTabs from './components/Tabs/Tabs.vue';

</script>

<style lang="scss" scoped>
.windpower {
	bottom: 3%;
	left: 50%;
	transform: translateX(-50%);
}
</style>