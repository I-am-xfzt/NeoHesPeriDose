<template>
  <div class="search-filter mt20 rounded-8">
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
      </div>
      <div class="categories flex s-flex-wrap gap-8">
        <button
          v-for="category in categories"
          :key="category"
          @click="
            activeCategory = category === activeCategory ? '全部' : category;
            emit('search', activeCategory, searchQuery);
          "
          :class="['category-btn hand rounded-16', { active: category === activeCategory }]"
        >
          {{ category }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="QuestionSearch">
import { Search, Refresh } from "@element-plus/icons-vue";

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(["search"]);
const searchQuery = ref("");
const activeCategory = ref("全部");
</script>

<style scoped lang="scss">
/* 搜索和筛选 */
.search-filter {
  background-color: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  :deep(.el-button){
    height: 34px !important;
    font-size: 14px !important;
  }
  .search-input {
    width: 100%;
    max-width: 400px;
    padding: 10px 14px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 14px;
    transition: border-color 0.3s ease;
    background-color: rgba(15, 23, 42, 0.6);
    color: #e0e0e0;
    &::placeholder {
      color: #94a3b8;
    }
    &:focus {
      outline: none;
      border-color: #42b883;
      box-shadow: 0 0 0 2px rgba(66, 184, 131, 0.2);
    }
  }

  .category-btn {
    padding: 6px 14px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(15, 23, 42, 0.6);
    font-size: 13px;
    transition: all 0.3s ease;
    color: #cbd5e1;

    &:hover {
      background-color: rgba(15, 23, 42, 0.8);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }

  .category-btn.active {
    background-color: #42b883;
    color: white;
    border-color: #42b883;
  }
}
</style>
