<script setup lang="ts" name="fyh-table">
import { ElTable, ElTableColumn } from "element-plus";
import DictTag from "@/components/DictTag/index.vue";
import { loadModule } from "@/utils/index";
import { useDictStore } from "@/stores/modules/dict";
const dictStore = useDictStore();

interface baseProps {
  modulePath: string;
  showSelection?: boolean; // 是否显示选择框
  filesName?: string; // 所需要加载的文件中导出的配置项对象名字 默认default
}
const props = withDefaults(defineProps<baseProps>(), {
  showSelection: false, // 是否显示选择框
  filesName: "default"
});
const theOptions = ref<tableColumnOp[]>([]);
const initOptions = async () => {
  const result = await loadModule(`${props.modulePath}`, `tableOptions.ts`);
  theOptions.value = result[props.filesName] ?? [];
};
onBeforeMount(initOptions);
</script>
<template>
  <el-table v-bind="$attrs">
    <el-table-column v-if="showSelection" type="selection" width="55" />
    <template v-for="(row, index) in theOptions" :key="index">
      <el-table-column v-if="!row['children']" v-bind="row" align="center">
        <template #default="{ row: info, $index }">
          <slot v-if="row.slots" :name="row.slots" :row="info"></slot>
          <template v-else>
            <DictTag
              v-if="row.isTag"
              :options="dictStore.getDict(row.dict!)"
              :value="info[row.prop]"
              @click="$emit('clickTag', info)"
            />
            <template v-else>
              <span v-if="row.type === 'index'">{{ $index + 1 }}</span>
              <component
                v-else
                :is="row.com?.name ?? `span`"
                v-bind="row.com?.attrs ?? {}"
                v-on:[row.methods?.event]="$emit(row.methods?.name ?? '', info)"
              >
                {{ row.formatter ? row.formatter(info, $index) : info[row["prop"]] }}
              </component>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-else v-bind="row" align="center">
        <el-table-column v-for="v in row.children" :key="v.prop" v-bind="v" align="center" />
      </el-table-column>
    </template>
    <slot />
  </el-table>
</template>
