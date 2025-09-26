declare type positionEnum = "left" | "right" | "top" | "";
declare type elComNameType = "select" | "input" | "date-picker" | "radio-group";

declare interface elComAttrAndFunType {
  formItem: FormItemsOptionsType;
  attrs?: EmptyObjectType;
  typeName?: elComNameType;
  isInter?: string | SelectOptionType[];
  dict?: string;
  aboutName?: string; // 关联字段名称; 因为select组件v-model绑定id等，但有时候不仅需要id，还需要其他字段，所以需要传入关联字段名称
  methods?: {
    event: string;
    name: string;
  };
  span: number;
  slot?: string;
}

/**
 * el-form 属性配置
 */
declare interface FormOptions {
  labelWidth?: string; // 标签宽度
  inline?: boolean; // 是否为行内表单
  labelPosition?: positionEnum; // 标签位置
  size?: string; // 表单尺寸
  disabled?: boolean; // 是否禁用表单
  labelSuffix?: string; // 标签后缀
  statusIcon?: boolean; // 是否显示状态图标
}

declare interface FormItemsOptionsType {
  prop: string;
  label?: string;
  labelPosition?: positionEnum;
  labelWidth?: string;
  required?: boolean;
  rules?: Function | EmptyObjectType;
}

declare interface FyhComOptions {
  form: FormOptions;
  rules?: (model: EmptyObjectType) => EmptyObjectType;
  columns: Array<elComAttrAndFunType[]>;
  dicts?: string[];
  countInter?: (string | SelectOptionType)[];
}
declare interface tableColumnOp {
  /** 列标签 */
  label: string;
  /** 最小宽度 */
  minWidth: number;
  /** 是否为标签类型 */
  isTag?: boolean;
  /** 数据字段名 */
  prop: string;
  /** 字典名称 */
  dict?: string;
  /** 格式化函数 */
  formatter?: (...args: EmptyArrayType) => VNode | string;
  children?: tableColumnOp[]; // 树形列
  /** 列类型 */
  type?: string;
  /** 插槽名称 */
  slots?: string;
  /** 事件名称 */
  methods?: {
    event: string;
    name: string;
  };
  /** 组件配置 */
  com?: {
    name: string;
    attrs?: Record<string, any>;
  };
  handleOp?: (row: EmptyObjectType, op: tableColumnOp) => void;
  /** 选项配置 */
  theOptions?: Array<{
    prop: string;
    label: string;
  }>;
  [k: string]: any; // 添加索引签名，允许添加任意属性
}
