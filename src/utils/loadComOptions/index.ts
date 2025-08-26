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

import type {FormItemRule} from "element-plus"
import {abCreateComOptions} from "./type"

/**
 * 获取el-form组件属性参数配置
 * @param  { FormOptions } options
 * @returns { FormOptions } 返回el-form组件的配置项
 * @example 函数调用示例 const formOptions = getFormOptions({labelWidth: "100px", disabled: true});
 */
export const getFormOptions = (options: FormOptions): FormOptions => {
        // 设置默认值
        const defaults: FormOptions = {
            labelWidth: '80px',
            inline: true,
            labelPosition: 'right',
            size: 'small',
            disabled: false,
            labelSuffix: '',
            statusIcon: false,
        }
        return {...defaults, ...options}
    },
    /**
     * @description 获取表单item配置项
     * @param { FormItemsOptionsType } options
     * @param {Array<string>} params
     * @return { FormItemsOptionsType } 返回el-form-item组件的配置项
     * @example const formItemOptions = getFormItemsOptions({labelPosition: '', labelWidth: '', required: false, rules: {},}, 'xxx', 'xxx')
     */
    getFormItemsOptions = (options: FormItemsOptionsType, ...params: Array<string>): FormItemsOptionsType => {
        const [a, b] = params,
            defaults: FormItemsOptionsType = {
                prop: a,
                label: b,
                labelPosition: '',
                labelWidth: '',
                required: false,
                rules: {},
            }
        return {
            ...defaults,
            ...options,
        }
    }

/**
 * @classDesc 加载组建配置的方法类
 */
export class loadComOptions implements abCreateComOptions.ILoadComOptions {
    public getFormOptions: typeof getFormOptions

    constructor() {
        this.getFormOptions = getFormOptions
    }

    /**
     * 从数据中提取字典名称
     * @param { Array<elComAttrAndFunType>[] } data
     * @param { string } ruleSymbols
     * @returns { Array<string> }
     */
    public countDict(data: Array<elComAttrAndFunType>[], ruleSymbols: string = '_'): Array<string> {
        return data
            .map((v) =>
                v.filter((m) => m.dict && m.dict.includes(ruleSymbols)).map((s) => s.dict)
            )
            .flat(1) as Array<string>
    }

    /**
     * 从数据中提取接口名称
     * @param { Array<elComAttrAndFunType>[] } data
     * @return { Array<string> }
     */
    public countInter(data: Array<elComAttrAndFunType>[]): Array<string> {
        return data
            .map((v) => v.filter((m) => m.isInter).map((s) => s.isInter))
            .flat(1) as Array<string>
    }

    /**
     * 创建单个表单验证规则
     * @param { abCreateComOptions.ruleDataInter['rule']} p
     * @param { FormItemRule[] } other
     * @return { Array<FormItemRule> }
     * @example
     */
    public createSingleRules(
        other: FormItemRule[] = [],
        ...p: abCreateComOptions.ruleDataInter['rule']
    ): Array<FormItemRule> {
        const [message, trigger, pattern, validator, type, transform] = p
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
        ]
    }

    /**
     * @description 生成完整的el-form 校验对象
     * @param {EmptyObjectType<FormItemRule>} p
     * @return {EmptyObjectType<FormItemRule[]>}
     */
    public createFormRules(p: EmptyObjectType<abCreateComOptions.ruleDataInter>): EmptyObjectType<FormItemRule[]> {
        const rules: EmptyObjectType<FormItemRule[]> = {}
        for (const rule in p) {
            rules[rule] = this.createSingleRules(p[rule].otherRules, ...p[rule].rule)
        }
        return rules
    }
}

export class allElFormItemsOptions implements abCreateComOptions.IAllElFormItemsOptions {
    /**
     * 获取Select组件配置
     * @param {SelectConfig} p - Select配置参数
     * @returns {elComAttrAndFunType} Select组件配置
     */
    public getSelect(p: abCreateComOptions.SelectConfig): elComAttrAndFunType {
        const {
            multiple = true,
            prop = 'estateIds',
            span = 12,
            label = '带访项目',
            aboutName = 'estateNames',
            eventName = 'handleChange',
            disabled = false,
            isInter = '',
            dict = '',
        } = p
        return {
            formItem: getFormItemsOptions({}, prop, label),
            attrs: {
                placeholder: '请选择',
                prop,
                clearable: true,
                multiple,
                disabled
            },
            typeName: 'select',
            isInter,
            dict,
            aboutName, // 关联字段名称, 因为select组件v-model绑定id等，但有时候不仅需要id，还需要其他字段，所以需要传入关联字段名称
            methods: {
                event: 'change',
                name: eventName,
            },
            span,
        }
    }


    /**
     * 获取Input组件配置
     * @param {InputConfig} p - Input配置参数
     * @returns {elComAttrAndFunType} Input组件配置
     */
    public getInput(p: abCreateComOptions.InputConfig): elComAttrAndFunType {
        const {
            prop = 'val',
            label = '',
            span = 4
        } = p
        return {
            formItem: getFormItemsOptions({}, prop, label),
            typeName: 'input',
            attrs: {
                prop,
                label,
                placeholder: '请输入'
            },
            methods: {
                event: '',
                name: ''
            },
            span
        }
    }

    /**
     * 获取DatePicker组件配置
     * @param {DatePickerConfig} p - DatePicker配置参数
     * @returns {elComAttrAndFunType} DatePicker组件配置
     */
    public getDatePicker(p: abCreateComOptions.DatePickerConfig): elComAttrAndFunType {
        const {
            span = 4,
            width = '100%',
            label = '添加日期',
            prop = 'timeSlot',
            eventName = 'handleChange'
        } = p
        return {
            formItem: getFormItemsOptions({}, prop, label),
            attrs: {
                style: {
                    width,
                },
                placeholder: '请选择',
                type: 'daterange',
                'range-separator': '至',
                'start-placeholder': '开始日期',
                'end-placeholder': '结束日期',
                format: 'yyyy-MM-dd',
                valueFormat: 'timestamp',
                clearable: true,
            },
            typeName: 'date-picker',
            span,
            methods: {
                event: 'change',
                name: eventName,
            },
        }
    }

    /**
     * 获取radio-group组件配置
     * @param {DatePickerConfig} p - radio-group配置参数
     * @returns {elComAttrAndFunType} radio-group组件配置
     */
    getRadioGroup(p: abCreateComOptions.RadioGroupConfig): elComAttrAndFunType {
        const {
            span = 4,
            width = '100%',
            label = '添加日期',
            prop = 'timeSlot',
            eventName = 'handleChange'
        } = p
        return {
            formItem: getFormItemsOptions({}, prop, label),
            attrs: {
                style: {
                    width,
                },
            },
            typeName: 'radio-group',
            span,
            methods: {
                event: 'change',
                name: eventName,
            },
        }
    }
}
