<template>
  <div class="workflow-container">
    <div class="workflow-header">
      <h2>工作流程图编辑器</h2>
      <div class="workflow-toolbar">
        <el-button type="primary" @click="saveGraph">保存图表</el-button>
        <el-button @click="clearGraph">清空图表</el-button>
        <el-button @click="zoomIn">放大</el-button>
        <el-button @click="zoomOut">缩小</el-button>
        <el-button @click="resetZoom">重置缩放</el-button>
      </div>
    </div>
    <div class="workflow-content">
      <div class="lf-canvas" ref="canvasRef"></div>
      <div class="workflow-panel">
        <h3>节点类型</h3>
        <div class="node-list">
          <div class="node-item" @dragstart="onDragStart($event, 'startNode')" draggable="true">
            <div class="node-icon start">开始</div>
            <span>开始节点</span>
          </div>
          <div class="node-item" @dragstart="onDragStart($event, 'endNode')" draggable="true">
            <div class="node-icon end">结束</div>
            <span>结束节点</span>
          </div>
          <div class="node-item" @dragstart="onDragStart($event, 'taskNode')" draggable="true">
            <div class="node-icon task">任务</div>
            <span>任务节点</span>
          </div>
          <div class="node-item" @dragstart="onDragStart($event, 'conditionNode')" draggable="true">
            <div class="node-icon condition">判断</div>
            <span>判断节点</span>
          </div>
        </div>
      </div>
    </div>
    <div class="workflow-footer">
      <p>提示：从左侧拖拽节点到画布中，点击节点可编辑属性，拖拽节点可调整位置</p>
    </div>
  </div>
</template>

<script setup lang="ts" name="workflow">
import LogicFlow from "@logicflow/core";
import "@logicflow/core/lib/style/index.css";
import { StartNode, EndNode, TaskNode, ConditionNode } from "./nodes";
import { StraightEdge } from "./edges";
import { ref, onMounted, onUnmounted } from "vue";
import { useMessage } from "@/hooks/message";
const canvasRef = ref<HTMLDivElement>();
const lf = ref<LogicFlow>();
const message = useMessage();

// 初始化LogicFlow实例
const initLogicFlow = () => {
  if (!canvasRef.value) return;

  lf.value = new LogicFlow({
    container: canvasRef.value,
    width: 1000,
    height: 600,
    grid: {
      size: 10,
      type: "dot"
    },
    background: {
      color: "#f5f7fa"
    },
    edgeType: "straight",
    nodeTextEdit: true,
    edgeTextEdit: true,
    keyboard: {
      enabled: true,
      shortcuts: [
        {
          keys: ["backspace"],
          callback: () => {
            const elements = lf.value?.getSelectElements() || [];
            if (elements.length) {
              lf.value?.deleteElements(elements);
            }
          }
        },
        {
          keys: ["ctrl", "z"],
          callback: () => lf.value?.undo()
        },
        {
          keys: ["ctrl", "y"],
          callback: () => lf.value?.redo()
        }
      ]
    }
  });

  // 注册自定义节点
  lf.value.register(StartNode);
  lf.value.register(EndNode);
  lf.value.register(TaskNode);
  lf.value.register(ConditionNode);
  lf.value.register(StraightEdge);

  // 加载默认流程图示例
  loadDefaultGraph();

  // 渲染画布
  lf.value.render();

  // 添加事件监听
  addEventListeners();
};

// 加载默认流程图示例
const loadDefaultGraph = () => {
  const graphData = {
    nodes: [
      {
        id: "start",
        type: "startNode",
        x: 100,
        y: 100,
        text: "开始"
      },
      {
        id: "task1",
        type: "taskNode",
        x: 300,
        y: 100,
        text: "需求分析"
      },
      {
        id: "condition1",
        type: "conditionNode",
        x: 500,
        y: 100,
        text: "需求是否清晰?"
      },
      {
        id: "task2",
        type: "taskNode",
        x: 700,
        y: 50,
        text: "详细设计"
      },
      {
        id: "task3",
        type: "taskNode",
        x: 700,
        y: 150,
        text: "需求沟通"
      },
      {
        id: "task4",
        type: "taskNode",
        x: 900,
        y: 100,
        text: "开发实现"
      },
      {
        id: "end",
        type: "endNode",
        x: 1100,
        y: 100,
        text: "结束"
      }
    ],
    edges: [
      {
        id: "e1",
        type: "straight",
        sourceNodeId: "start",
        targetNodeId: "task1"
      },
      {
        id: "e2",
        type: "straight",
        sourceNodeId: "task1",
        targetNodeId: "condition1"
      },
      {
        id: "e3",
        type: "straight",
        sourceNodeId: "condition1",
        targetNodeId: "task2",
        text: "是"
      },
      {
        id: "e4",
        type: "straight",
        sourceNodeId: "condition1",
        targetNodeId: "task3",
        text: "否"
      },
      {
        id: "e5",
        type: "straight",
        sourceNodeId: "task2",
        targetNodeId: "task4"
      },
      {
        id: "e6",
        type: "straight",
        sourceNodeId: "task3",
        targetNodeId: "task1"
      },
      {
        id: "e7",
        type: "straight",
        sourceNodeId: "task4",
        targetNodeId: "end"
      }
    ]
  };

  lf.value?.render(graphData);
};

// 添加事件监听器
const addEventListeners = () => {
  lf.value?.on("node:click", data => {
    console.log("点击节点:", data);
  });

  lf.value?.on("edge:click", data => {
    console.log("点击连线:", data);
  });

  lf.value?.on("node:add", data => {
    console.log("添加节点:", data);
  });

  lf.value?.on("edge:add", data => {
    console.log("添加连线:", data);
  });

  lf.value?.on("node:dragend", data => {
    console.log("节点拖拽结束:", data);
  });
};

// 保存图表数据
const saveGraph = () => {
  const graphData = lf.value?.getGraphData();
  if (graphData) {
    console.log("保存图表数据:", graphData);
    // 这里可以将图表数据保存到后端
    message.success("图表保存成功");
  }
};

// 清空图表
const clearGraph = () => {
  lf.value?.clear();
  message.info("图表已清空");
};

// 放大
const zoomIn = () => {
  lf.value?.zoom(true);
};

// 缩小
const zoomOut = () => {
  lf.value?.zoom(false);
};

// 重置缩放
const resetZoom = () => {
  lf.value?.resetZoom();
};

// 拖拽节点开始
const onDragStart = (event: DragEvent, nodeType: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData("nodeType", nodeType);
  }
};

// 组件挂载时初始化
onMounted(() => {
  initLogicFlow();

  // 添加拖拽到画布的事件监听
  if (canvasRef.value) {
    canvasRef.value.addEventListener("dragover", event => {
      event.preventDefault();
    });

    canvasRef.value.addEventListener("drop", event => {
      event.preventDefault();
      const nodeType = event.dataTransfer?.getData("nodeType");
      if (nodeType && lf.value) {
        const rect = canvasRef.value.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 转换为画布坐标系
        const point = lf.value.getPointByClient(x, y);

        // 创建新节点
        const nodeId = `node_${Date.now()}`;
        const nodeData = {
          id: nodeId,
          type: nodeType,
          x: point.x,
          y: point.y,
          text: getDefaultNodeText(nodeType)
        };

        lf.value.addNode(nodeData);
      }
    });
  }
});

// 获取节点默认文本
const getDefaultNodeText = (nodeType: string): string => {
  const textMap: Record<string, string> = {
    startNode: "开始",
    endNode: "结束",
    taskNode: "任务",
    conditionNode: "判断"
  };
  return textMap[nodeType] || "节点";
};

// 组件卸载时清理
onUnmounted(() => {
  lf.value?.destroy();
});
</script>

<style scoped>
.workflow-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
}

.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #f0f2f5;
  border-bottom: 1px solid #dcdfe6;
}

.workflow-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.workflow-toolbar {
  display: flex;
  gap: 8px;
}

.workflow-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.lf-canvas {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #ebeef5;
  margin: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.workflow-panel {
  width: 200px;
  background-color: #fafafa;
  border-left: 1px solid #ebeef5;
  padding: 16px;
  overflow-y: auto;
}

.workflow-panel h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.node-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: grab;
  transition: all 0.3s ease;
}

.node-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.node-item:active {
  cursor: grabbing;
}

.node-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
}

.node-icon.start {
  background-color: #67c23a;
}

.node-icon.end {
  background-color: #f56c6c;
}

.node-icon.task {
  background-color: #409eff;
}

.node-icon.condition {
  background-color: #e6a23c;
}

.node-item span {
  font-size: 14px;
  color: #606266;
}

.workflow-footer {
  padding: 12px 24px;
  background-color: #f0f2f5;
  border-top: 1px solid #dcdfe6;
}

.workflow-footer p {
  margin: 0;
  font-size: 12px;
  color: #909399;
}
</style>
