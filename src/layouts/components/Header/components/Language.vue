<template>
  <el-dropdown class="pt3" trigger="click" @command="changeLanguage">
    <svg-icon :icon-style="{ width: '22px', height: '22px', fill: '#4a88f5' }" name="ZnCh" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in languageList"
          :key="item.value"
          :command="item.value"
          :disabled="language === item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useGlobalStore } from "@/stores/modules/global";

const i18n = useI18n();
const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);

const languageList = [
  { label: "简体中文", value: "zh" },
  { label: "English", value: "en" }
];

const changeLanguage = (lang: string) => {
  i18n.locale.value = lang;
  globalStore.setGlobalState("language", lang as LanguageType);
};
</script>
