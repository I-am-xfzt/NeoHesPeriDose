/**
 * @description 加载组件配置项的方法类
 * @author 范永豪
 * @version 1.0.0
 * @license MIT
 * @module LoadComOptions
 * @example
 * import { LoadComOptions } from 'src/optionsClass/loadComOptions';
 * const xxx = new LoadComOptions();
 * @Date 2025-07-23
 */

import {elComAttrAndFunType} from "../types/fyhCom";

/**
 * 获取el-form组件属性参数配置
 * @param  { ...any } options
 * @returns { FormOptions } 返回el-form组件的配置项
 * @example 函数调用示例 const formOptions = getFormOptions({labelWidth: "100px", disabled: true});
 */
export const getFormOptions = (...options: EmptyArrayType): FormOptions => {
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
        return {...defaults, ...options[0]}
    },
    /**
     * @description 获取表单item配置项
     * @param {FormItemsOptionsType} options
     * @param {EmptyArrayType} params
     */
    getFormItemsOptions = (options: FormItemsOptionsType, ...params: EmptyArrayType) => {
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

export class LoadComOptions {
    constructor() {
        this.getFormOptions = getFormOptions
    }

    /**
     * 从数据中提取字典名称
     * @param data
     * @returns
     */
    public countDict(data: EmptyArrayType[]): string[] {
        return data
            .map((v) =>
                v.filter((m) => m.dict && m.dict.includes('_')).map((s) => s.dict)
            )
            .flat(1)
    }

    public countInter(data: EmptyArrayType[]) {
        return data
            .map((v) => v.filter((m) => m.isInter).map((s) => s.isInter))
            .flat(1)
    }

    /**
     * 创建表单验证规则
     * @param message
     * @param trigger
     * @param pattern
     * @param other
     * @returns
     */
    public createRules(
        message: string,
        trigger: 'blur' | 'change' = 'blur',
        pattern,
        other
    ) {
        const rules = [
            {
                required: true,
                message,
                trigger,
                pattern,
            },
        ]
        pattern && (rules[0].pattern = pattern)
        other && rules.push(other)
        return rules
    }
}

export class allElFormItemsOptions {
    public getSelect({
                         multiple = true,
                         prop = 'estateIds',
                         span = 12,
                         label = '带访项目',
                         aboutName = 'estateNames',
                         eventName = 'handleChange',
                         disabled = false,
                         isInter = '',
                         dict = '',
                     }): elComAttrAndFunType {
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

    public getInput({
                        prop = 'val',
                        label = '和法治',
                        span = 4
                    }): elComAttrAndFunType {
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

    public getDatePicker(
        {
            span = 4,
            width = '100%',
            label = '添加日期',
            prop = 'timeSlot',
            eventName = ''
        }
    ) {
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
}
