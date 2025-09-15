// const [message, trigger, pattern, validator, type, transform] = p
import type {FormItemRule} from "element-plus";

/**
 * @namespace * @description 创建表单组件属性配置
 * @author fyh
 * import { Index } from 'src/utils/loadComOptions/type';
 * @Date 2025-08-22
 */
export namespace abCreateComOptions {
    type theTrigger = 'change' | 'blur';
    type thePattern = RegExp | string | undefined;
    export interface commonItem {
        prop?: string;
        span?: number;
        label?: string;
        width?: string;
        eventName?: string,
        disabled?: boolean,
        placeholder?: string;
    }
    export interface ruleDataInter {
        otherRules?: FormItemRule[];
        rule: [theTrigger | theTrigger[], string | undefined, thePattern?, FormItemRule['validator']?, FormItemRule['type']?, FormItemRule['transform']?]
    }

    /** Select组件配置接口 */
    export interface SelectConfig extends commonItem{
        multiple?: boolean;
        aboutName?: string;
        isInter?: string;
        dict?: string;
    }

    /** Input组件配置接口 */
    export interface InputConfig extends commonItem {}

    /** DatePicker组件配置接口 */
    export interface DatePickerConfig extends commonItem{
        eventName?: string;
    }
    export interface RadioGroupConfig extends commonItem{}

    /** 组件配置选项加载器接口 */
    export interface ILoadComOptions {
        getFormOptions(options: FormOptions): FormOptions;

        countDict(data: elComAttrAndFunType[][], ruleSymbols?: string): string[];

        countInter(data: elComAttrAndFunType[][]): string[];

        createSingleRules(other: FormItemRule[], ...p: ruleDataInter['rule']): FormItemRule[];

        createFormRules(p: EmptyObjectType<ruleDataInter>): EmptyObjectType<FormItemRule[]>;
    }

    /** 所有表单组件选项接口 */
    export interface IAllElFormItemsOptions {

        getSelect(p: SelectConfig, itemOp: FormItemsOptionsType): elComAttrAndFunType;

        getInput(p: InputConfig, itemOp: FormItemsOptionsType): elComAttrAndFunType;

        getDatePicker(p: DatePickerConfig, itemOp: FormItemsOptionsType): elComAttrAndFunType;
    }
}