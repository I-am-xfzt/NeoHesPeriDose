import { PolylineEdge } from '@logicflow/core/lib/view/edge';
import { PolylineEdgeModel } from '@logicflow/core/lib/model/edge';

// 自定义直线边视图
class StraightEdgeView extends PolylineEdge {
  static extendKey = 'straight';
  
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.stroke = '#909399';
    style.strokeWidth = 2;
    style.strokeDasharray = this.model.isAnimation ? '5 5' : 'none';
    
    // 如果是选中状态，改变颜色
    if (this.model.isSelected) {
      style.stroke = '#409eff';
      style.strokeWidth = 3;
    }
    
    return style;
  }
  
  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 12;
    style.fill = '#606266';
    return style;
  }
  
  getArrowStyle() {
    const style = super.getArrowStyle();
    style.fill = '#909399';
    style.stroke = '#909399';
    style.strokeWidth = 1;
    
    // 如果是选中状态，改变箭头颜色
    if (this.model.isSelected) {
      style.fill = '#409eff';
      style.stroke = '#409eff';
    }
    
    return style;
  }
}

// 自定义直线边模型
class StraightEdgeModel extends PolylineEdgeModel {
  static extendKey = 'straight';
  
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.stroke = '#909399';
    style.strokeWidth = 2;
    return style;
  }
  
  getLineConfig() {
    const lineConfig = super.getLineConfig();
    // 对于直线边，我们使用LineEdgeModel的getLineConfig方法
    // 但保持PolylineEdgeModel的其他功能
    return lineConfig;
  }
}

// 注册边配置
const StraightEdge = {
  view: StraightEdgeView,
  model: StraightEdgeModel
};

export { StraightEdge };