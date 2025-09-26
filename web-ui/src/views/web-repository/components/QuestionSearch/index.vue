<template>
  <div class="search-filter mt15 mb10 rounded-8">
    <div class="pl20 pr20">
      <div class="FlexBox mb12">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索题目..."
          @keyup.enter="emit('search', activeCategory, searchQuery)"
          class="search-input mr10 rounded-6"
        />
        <el-button size="default" type="primary" :icon="Search" @click="emit('search', activeCategory, searchQuery)">搜索</el-button>
        <el-button size="default" :icon="Refresh" @click="searchQuery = ''; emit('search', activeCategory, searchQuery)">重置</el-button>
        <el-button size="default" type="add" :icon="FolderAdd" @click="emit('addQuestion', 'add')">添加题目</el-button>
      </div>
      <div class="categories flex s-flex-wrap gap-8">
        <button
          v-for="category in categories"
          :key="category.label"
          @click="
            activeCategory = category.label === activeCategory ? '全部' : category.label;
            emit('search', activeCategory, searchQuery);
          "
          :class="['category-btn hand rounded-16', { active: category.label === activeCategory }]"
        >
          {{ category.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="QuestionSearch">
import { Search, Refresh, FolderAdd } from "@element-plus/icons-vue";

defineProps<{categories: SelectOptionType[]}>();
const emit = defineEmits(["search", "addQuestion"]);
const searchQuery = ref("");
const activeCategory = ref("全部");
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
