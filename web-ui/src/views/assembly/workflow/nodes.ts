import { CircleNode, RectNode, DiamondNode } from '@logicflow/core/lib/view/node';
import { CircleNodeModel, RectNodeModel, DiamondNodeModel } from '@logicflow/core/lib/model/node';

// 开始节点视图
class StartNodeView extends CircleNode {
  static extendKey = 'startNode';
  
  getShapeStyle() {
    const style = super.getShapeStyle();
    style.fill = '#67c23a';
    style.stroke = '#67c23a';
    style.strokeWidth = 2;
    return style;
  }
  
  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 14;
    style.fill = '#ffffff';
    return style;
  }
}

// 开始节点模型
class StartNodeModel extends CircleNodeModel {
  static extendKey = 'startNode';
  
  setAttributes() {
    super.setAttributes();
    this.r = 30;
  }
}

// 结束节点视图
class EndNodeView extends CircleNode {
  static extendKey = 'endNode';
  
  getShapeStyle() {
    const style = super.getShapeStyle();
    style.fill = '#f56c6c';
    style.stroke = '#f56c6c';
    style.strokeWidth = 2;
    return style;
  }
  
  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 14;
    style.fill = '#ffffff';
    return style;
  }
}

// 结束节点模型
class EndNodeModel extends CircleNodeModel {
  static extendKey = 'endNode';
  
  setAttributes() {
    super.setAttributes();
    this.r = 30;
  }
}

// 任务节点视图
class TaskNodeView extends RectNode {
  static extendKey = 'taskNode';
  
  getShapeStyle() {
    const style = super.getShapeStyle();
    style.fill = '#ffffff';
    style.stroke = '#409eff';
    style.strokeWidth = 2;
    return style;
  }
  
  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 14;
    style.fill = '#303133';
    return style;
  }
}

// 任务节点模型
class TaskNodeModel extends RectNodeModel {
  static extendKey = 'taskNode';
  
  setAttributes() {
    super.setAttributes();
    this.width = 100;
    this.height = 60;
  }
}

// 判断节点视图
class ConditionNodeView extends DiamondNode {
  static extendKey = 'conditionNode';
  
  getShapeStyle() {
    const style = super.getShapeStyle();
    style.fill = '#ffffff';
    style.stroke = '#e6a23c';
    style.strokeWidth = 2;
    return style;
  }
  
  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 14;
    style.fill = '#303133';
    return style;
  }
}

// 判断节点模型
class ConditionNodeModel extends DiamondNodeModel {
  static extendKey = 'conditionNode';
  
  setAttributes() {
    super.setAttributes();
    this.width = 80;
    this.height = 80;
  }
}

// 注册节点配置
const StartNode = {
  view: StartNodeView,
  model: StartNodeModel
};

const EndNode = {
  view: EndNodeView,
  model: EndNodeModel
};

const TaskNode = {
  view: TaskNodeView,
  model: TaskNodeModel
};

const ConditionNode = {
  view: ConditionNodeView,
  model: ConditionNodeModel
};

export { StartNode, EndNode, TaskNode, ConditionNode };