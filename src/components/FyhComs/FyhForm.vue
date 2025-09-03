<template>
  <component
    :is="'el-form'"
    v-bind="theOptions.form"
    :disabled="formDisabled"
    ref="FyhFormRef"
    :model="model"
    :class="{ flexForm: theOptions.form.inline }"
  >
    <template v-for="item in theOptions.columns">
      <el-row :gutter="gutter">
        <el-col v-for="v in item" :span="v.span" :key="v.formItem.prop">
          <component :is="'el-form-item'" v-bind="v.formItem">
            <slot v-if="v.slot" :name="v.slot" :val="model"></slot>
            <template v-else>
              <component
                :is="`el-${v.typeName}`"
                v-bind="v.attrs"
                v-model="model[v.formItem.prop]"
                v-on:[v.methods!.event]="(...val: any) => handleEmit(val, v)"
              >
                <component
                  :is="tagOptions[v.typeName as keyof typeof tagOptions]"
                  v-for="dict in dictMaps[v.dict as keyof typeof dictMaps]"
                  :key="dict.value"
                  :value="dict.value"
                  >{{ dict.label }}
                </component>
              </component>
            </template>
          </component>
        </el-col>
      </el-row>
    </template>
    <!-- <el-row :gutter="gutter">
      <template v-if="DICT.projectData">
        <slot name="form-item-extra" :select="DICT"> </slot>
      </template>
    </el-row> -->
  </component>
</template>

<script setup lang="ts" name="fyh-form">
import { loadModule } from "@/utils/index";
import { useDict } from "@/hooks/dict";

interface baseProps {
  modelValue: {
    [key: string]: any;
  }; // 表单数据
  disabled?: boolean; // 是否禁用表单
  modulePath: string; // 表单配置项模块路径
  needLoadTableDict?: boolean; // 是否需要加载字典
  gutter?: number; // 表单列间距
  fileName?: string; // 所需要加载的文件中导出的配置项对象名字 默认default
}

const dictMaps = ref<Record<string, SelectOptionType[]>>({});
const tagOptions = {
  select: "el-option",
  "checkbox-group": "el-checkbox",
  "radio-group": "el-radio"
};
const theEmit = defineEmits(["update:disabled", "update:modelValue"]);
const props = withDefaults(defineProps<baseProps>(), {
  needLoadTableDict: false,
  gutter: 10,
  fileName: "default",
  disabled: false
});
const theOptions = ref<FyhComOptions>({
  form: {},
  columns: [],
  dicts: []
});
/**
 * 动态表单禁用
 * @type {boolean}
 * @description 通过 v-model:disabled 双向绑定
 * @example <fyh-form v-model:disabled="xxx" />
 */
const formDisabled = computed({
  get: () => props.disabled,
  set: (val: boolean) => theEmit("update:disabled", val)
});

const model = computed({
  get: () => props.modelValue,
  set: (val: any) => theEmit("update:modelValue", val)
});
const handleEmit = (val: any, row: elComAttrAndFunType) => {};
const getDictData = () => {
  dictMaps.value = useDict(...theOptions.value.dicts!);
};
const initOptions = async () => {
  const res = <EmptyObjectType<FyhComOptions>>await loadModule(props.modulePath);
  theOptions.value = res[props.fileName] || {};
  theOptions.value.dicts && theOptions.value.dicts.length > 0 && getDictData();
  console.log(theOptions.value, 'theOptions');
};
onBeforeMount(initOptions);
</script>

<style lang="scss" scoped>
.el-form {
  :deep(.el-form-item) {
    margin-right: 0px;

    .el-form-item__content > div {
      width: 100%;
    }
  }
}

.flexForm {
  :deep(.el-form-item) {
    margin-bottom: 10px;
    width: 100%;
    display: flex;

    .el-form-item__content {
      flex: 1;
    }

    .el-form-item__label {
      font-size: 12px;
    }
  }
}
</style>
