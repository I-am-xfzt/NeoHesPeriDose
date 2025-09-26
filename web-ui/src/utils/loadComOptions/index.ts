/**
 * @description 加载组件配置项的方法类
 * @author fyh
 * @version 1.0.0
 * @license MIT
 * @module LoadComOptions
 * @example
 * import { Index } from 'src/utils/loadComOptions/index';
 * const xxx = new Index();
 * @Date 2025-07-23
 */

import type { FormItemRule } from "element-plus";
import { abCreateComOptions } from "./type";

export type rulesParamType = EmptyObjectType<abCreateComOptions.ruleDataInter>;
/**
 * 获取el-form组件属性参数配置
 * @param  { FormOptions } options
 * @returns { FormOptions } 返回el-form组件的配置项
 * @example 函数调用示例 const formOptions = getFormOptions({labelWidth: "100px", disabled: true});
 */
export const getFormOptions = (options: FormOptions): FormOptions => {
    // 设置默认值
    const defaults: FormOptions = {
      labelWidth: "80px",
      inline: true,
      labelPosition: "right",
      // size: useGlobalStore().assemblySize,
      disabled: false,
      labelSuffix: "",
      statusIcon: false
    };
    return { ...defaults, ...options };
  },
  /**
   * @description 获取表单item配置项
   * @param { FormItemsOptionsType } options
   * @param {Array<string>} params
   * @return { FormItemsOptionsType } 返回el-form-item组件的配置项
   * @example const formItemOptions = getFormItemsOptions({labelPosition: '', labelWidth: '', required: false, rules: {},}, 'xxx', 'xxx')
   */
  getFormItemsOptions = (options: FormItemsOptionsType | Object): FormItemsOptionsType => {
    const defaults: FormItemsOptionsType = {
      prop: "",
      label: "",
      labelPosition: "",
      labelWidth: "",
      required: false,
      rules: {}
    };
    return {
      ...defaults,
      ...options
    };
  };

/**
 * @classDesc 加载组建配置的方法类
 */
export class loadComOptions implements abCreateComOptions.ILoadComOptions {
  public getFormOptions: typeof getFormOptions;

  constructor() {
    this.getFormOptions = getFormOptions;
  }

  /**
   * 从数据中提取字典名称
   * @param { Array<elComAttrAndFunType>[] } data
   * @param { string } ruleSymbols
   * @returns { Array<string> }
   */
  public countDict(data: Array<elComAttrAndFunType>[], ruleSymbols: string = "_"): Array<string> {
    return data.map(v => v.filter(m => m.dict && m.dict.includes(ruleSymbols)).map(s => s.dict)).flat(1) as Array<string>;
  }

  /**
   * 从数据中提取接口名称
   * @param { Array<elComAttrAndFunType>[] } data
   * @return { Array<string> }
   */
  public countInter(data: Array<elComAttrAndFunType>[]): Array<string | SelectOptionType[]> {
    return data.map(v => v.filter(m => m.isInter).map(s => s.isInter)).flat(1) as Array<string | SelectOptionType[]>;
  }

  /**
   * 创建单个表单验证规则
   * @param { abCreateComOptions.ruleDataInter['rule']} p
   * @param { FormItemRule[] } other
   * @return { Array<FormItemRule> }
   * @example
   */
  public createSingleRules(other: FormItemRule[] = [], ...p: abCreateComOptions.ruleDataInter["rule"]): Array<FormItemRule> {
    const [trigger, message, pattern, validator, type, transform] = p;
    return [
      {
        required: true,
        message,
        trigger,
        pattern,
        validator,
        type,
        transform
      },
      ...other
    ];
  }

  /**
   * @description 生成完整的el-form 校验对象
   * @param {rulesParamType} p
   * @return {EmptyObjectType<FormItemRule[]>}
   * @example
   * ```
   * const rules = createFormRules({
   *  sourceSystem: {
   *    rule: ['请选择源坐标系', 'blur'],
   *    otherRules: []
   *  },
   *  targetSystem: {
   *    rule: ['请选择目标坐标系', 'blur'],
   *    otherRules: []
   *  },
   *  inputX: {
   *    rule: ['请输入源坐标X', 'blur'],
   *    otherRules: []
   *  },
   *  inputY: {
   *    rule: ['请输入源坐标Y', 'blur'],
   *    otherRules: []
   *  },
   * })
   * ```
   */
  public createFormRules(p: rulesParamType): EmptyObjectType<FormItemRule[]> {
    const rules: EmptyObjectType<FormItemRule[]> = {};
    for (const rule in p) {
      rules[rule] = this.createSingleRules(p[rule].otherRules, ...p[rule].rule);
    }
    return rules;
  }
}

export class allElFormItemsOptions implements abCreateComOptions.IAllElFormItemsOptions {
  /**
   * 获取Select组件配置
   * @param {SelectConfig} p - Select配置参数
   * @returns {elComAttrAndFunType} Select组件配置
   */
  public getSelect(p: abCreateComOptions.SelectConfig, itemOp: FormItemsOptionsType): elComAttrAndFunType {
    const {
      placeholder,
      multiple = false,
      span = 12,
      aboutName = "estateNames",
      eventName = "handleChange",
      disabled = false,
      isInter = "",
      clearable = true,
      dict = ""
    } = p;
    return {
      formItem: getFormItemsOptions(itemOp),
      attrs: {
        placeholder: placeholder || "请选择" + itemOp.label,
        prop: itemOp.prop,
        clearable,
        multiple,
        disabled
      },
      typeName: "select",
      isInter,
      dict,
      aboutName, // 关联字段名称, 因为select组件v-model绑定id等，但有时候不仅需要id，还需要其他字段，所以需要传入关联字段名称
      methods: {
        event: "change",
        name: eventName
      },
      span
    };
  }

  /**
   * 获取Input组件配置
   * @param {InputConfig} p - Input配置参数
   * @returns {elComAttrAndFunType} Input组件配置
   */
  public getInput(p: abCreateComOptions.InputConfig, itemOp: FormItemsOptionsType): elComAttrAndFunType {
    const { placeholder, span = 4, disabled = false, type = "text", rows } = p;
    return {
      formItem: getFormItemsOptions(itemOp),
      typeName: "input",
      attrs: {
        prop: itemOp.prop,
        label: itemOp.label,
        placeholder: placeholder || "请输入" + itemOp.label,
        disabled,
        type,
        clearable: true,
        rows
      },
      methods: {
        event: "",
        name: ""
      },
      span
    };
  }

  /**
   * 获取DatePicker组件配置
   * @param {DatePickerConfig} p - DatePicker配置参数
   * @returns {elComAttrAndFunType} DatePicker组件配置
   */
  public getDatePicker(p: abCreateComOptions.DatePickerConfig, itemOp: FormItemsOptionsType): elComAttrAndFunType {
    const { span = 4, width = "100%", placeholder, eventName = "handleChange" } = p;
    return {
      formItem: getFormItemsOptions(itemOp),
      attrs: {
        style: {
          width
        },
        placeholder: placeholder || "请选择" + itemOp.label,
        type: "daterange",
        "range-separator": "至",
        "start-placeholder": "开始日期",
        "end-placeholder": "结束日期",
        format: "yyyy-MM-dd",
        valueFormat: "timestamp",
        clearable: true
      },
      typeName: "date-picker",
      span,
      methods: {
        event: "change",
        name: eventName
      }
    };
  }

  /**
   * 获取radio-group组件配置
   * @param {DatePickerConfig} p - radio-group配置参数
   * @returns {elComAttrAndFunType} radio-group组件配置
   */
  getRadioGroup(p: abCreateComOptions.RadioGroupConfig, itemOp: FormItemsOptionsType): elComAttrAndFunType {
    const { span = 4, width = "100%", label = "添加日期", prop = "timeSlot", eventName = "handleChange" } = p;
    return {
      formItem: getFormItemsOptions(itemOp),
      attrs: {
        style: {
          width
        }
      },
      typeName: "radio-group",
      span,
      methods: {
        event: "change",
        name: eventName
      }
    };
  }
}
