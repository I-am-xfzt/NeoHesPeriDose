<!-- 💥 这里是一次性加载 LayoutComponents -->
<template>
    <component :is="LayoutComponents['classic']" />
    <ThemeDrawer />
</template>

<script setup lang="ts" name="layout">
import { useGlobalStore } from "@/stores/modules/global";
import ThemeDrawer from "./components/ThemeDrawer/index.vue";
import LayoutClassic from "./LayoutClassic/index.vue";

const LayoutComponents: Record<'classic', Component> = {
  classic: LayoutClassic,
};

const globalStore = useGlobalStore();

const isDark = computed(() => globalStore.isDark);

const font = reactive({ color: "rgba(0, 0, 0, .15)" });
watch(isDark, () => (font.color = isDark.value ? "rgba(255, 255, 255, .15)" : "rgba(0, 0, 0, .15)"), {
  immediate: true
});
</script>

<style scoped lang="scss">
.layout {
  min-width: 600px;
}
</style>
