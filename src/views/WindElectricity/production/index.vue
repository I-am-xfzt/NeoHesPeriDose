<template>
	<Model sliceParams="实景" :modelPosition="modelPosition" />
</template>

<script setup lang='ts'>
import Model from "@/components/model/three/index.vue";
const modelPosition: Vector3Tuple[] = [
	[0, 10, 0],
	[0, 10, 0],
];
</script>

<style lang="scss" scoped></style>