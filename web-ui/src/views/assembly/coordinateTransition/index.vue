<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="FlexBox s-row-between">
          <h2>坐标转换工具</h2>
          <el-tag type="primary">支持多种坐标系互转</el-tag>
        </div>
      </template>
      <fyh-form ref="formRef" v-model="form" :module-path="modulePath"></fyh-form>
      <div class="t-center">
        <el-button type="primary" @click="handleConvert" :icon="Switch"
          :disabled="!form.inputX || !form.inputY">开始转换</el-button>
        <el-button type="success" :icon="DocumentCopy" :disabled="!result.length" @click="handleCopyResult">
          复制结果
        </el-button>
      </div>
      <div v-if="result.length > 0">
        <div class="result-header">
          <h3>转换结果</h3>
        </div>
        <div class="map-preview">
          <h4>地图预览</h4>
          <div ref="mapContainer" class="map-container"></div>
        </div>
      </div>
      <div class="history-section">
        <h3 class="pb10">历史记录</h3>
        <fyh-table :data="historyRecord" :module-path="modulePath">
          <template #operation="{ row }">
            <el-button text @click="copySingleCoordinate(row.target)"> 复制 </el-button>
            <el-button text :icon="Delete" @click="deleteRecord(row.id)"> 删除 </el-button>
          </template>
        </fyh-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="CoordinateConverter">
import { Delete, DocumentCopy, Switch } from "@element-plus/icons-vue";
import { useCoordinateTransitionStore } from "@/stores/business/coordinateTransition";
import FyhForm from "@/components/FyhComs/FyhForm.vue";
import FyhTable from "@/components/FyhComs/FyhTable.vue";
import {
  coordinateConvert,
  parseCoordinates,
  formatCoordinate,
  batchCoordinateConvert,
  exportToCSV,
  type Coordinate,
  type CoordinateSystem
} from "@/utils/coordinateTransform";
import { useMessage } from "@/hooks/message";
import { generateUUID } from "@/utils/other"
const formRef = ref<InstanceType<typeof FyhForm>>()
// 类型定义
interface ConversionResult {
  source: Coordinate;
  target: Coordinate;
  sourceType: string;
  targetType: string;
}
interface StateType {
  sourceSystem: CoordinateSystem;
  targetSystem: CoordinateSystem;
  inputX: string;
  inputY: string;
}
interface HistoryItem {
  id: string;
  source: string;
  sourceType: string;
  target: string;
  targetType: string;
  createTime: string;
}

const modulePath = "views/assembly/coordinateTransition";
const useCoordStore = useCoordinateTransitionStore();
const { historyRecord, setHistoryRecord, deleteRecord } = storeToRefs(useCoordStore);
// 表单数据
const form = reactive<StateType>({
  sourceSystem: "wgs84",
  targetSystem: "gcj02",
  inputX: "",
  inputY: "",
});
const result = ref<ConversionResult[]>([]);
const history = ref<any[]>([]);
const mapContainer = ref<HTMLDivElement | null>(null);

// 解析并转换坐标
const convertCoordinates = (input: string, from: CoordinateSystem, to: CoordinateSystem): ConversionResult[] => {
  const coordinates = parseCoordinates(input);
  if (coordinates.length === 0) {
    useMessage().error("请输入有效的坐标数据");
    throw new Error("请输入有效的坐标数据");
  }

  const results = batchCoordinateConvert(coordinates, from, to);
  const validResults: ConversionResult[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.success && result.data) {
      validResults.push({
        source: coordinates[index],
        target: result.data,
        sourceType: from.toUpperCase(),
        targetType: to.toUpperCase()
      });
    } else {
      errors.push(`第${index + 1}行: ${result.error || '转换失败'}`);
    }
  });

  if (errors.length > 0) {
    throw new Error(`转换错误:\n${errors.join('\n')}`);
  }
  return validResults;
};

// 处理转换
const handleConvert = async () => {
  if (!formRef.value) return;
  await formRef.value.FyhFormRef!.validate((valid) => {
    if (!valid) return;
    const convertedResults = convertCoordinates(
      form.inputY + "," + form.inputX,
      form.sourceSystem as CoordinateSystem,
      form.targetSystem as CoordinateSystem
    );
    result.value = convertedResults;
    // 保存到历史记录
    convertedResults.forEach(item => {
      const historyItem = {
        id: generateUUID(),
        source: `${item.source.lng.toFixed(6)}, ${item.source.lat.toFixed(6)}`,
        sourceType: item.sourceType,
        target: `${item.target.lng.toFixed(6)}, ${item.target.lat.toFixed(6)}`,
        targetType: item.targetType,
        createTime: new Date().toLocaleString()
      };
      useCoordStore.setHistoryRecord(historyItem);
    });
    useMessage().success(`成功转换 ${convertedResults.length} 个坐标点`);
  });
  try {

  } catch (error: any) {
    useMessage().error(error.message);
  }
};

// 保存到历史记录
const saveToHistory = (pointCount: number): void => {
  history.value.unshift({
    time: new Date().toLocaleString(),
    from: form.sourceSystem.toUpperCase(),
    to: form.targetSystem.toUpperCase(),
    count: pointCount,
    input: form.inputY + "," + form.inputX,
    result: result.value
  });

  // 只保留最近10条记录
  if (history.value.length > 10) {
    history.value = history.value.slice(0, 10);
  }
};

// 复制结果
const handleCopyResult = async () => {
  if (result.value.length === 0) {
    useMessage().warning("没有可复制的结果");
    return;
  }

  const text = result.value.map(item => formatCoordinate(item.target)).join("\n");

  try {
    await navigator.clipboard.writeText(text);
    useMessage().success("结果已复制到剪贴板");
  } catch (error) {
    useMessage().error("复制失败，请手动复制");
  }
};

// 复制单个坐标
const copySingleCoordinate = async (coord: string | Coordinate): Promise<void> => {
  let text: string;
  if (typeof coord === 'string') {
    text = coord;
  } else {
    text = formatCoordinate(coord);
  }

  try {
    await navigator.clipboard.writeText(text);
    useMessage().success("坐标已复制");
  } catch (error) {
    useMessage().error("复制失败");
  }
};

// 导出结果为CSV
const handleExportCSV = (): void => {
  if (result.value.length === 0) {
    useMessage().warning("没有可导出的数据");
    return;
  }

  const coordinates = result.value.map(item => item.target);
  const csvContent = exportToCSV(coordinates, ["经度", "纬度"]);

  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `坐标转换结果_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  useMessage().success("CSV文件已下载");
};

onMounted(() => {
  // 初始化时可以加载一些示例或默认设置
});
</script>

<style scoped>

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.map-preview {
  margin-top: 20px;
}

.map-container {
  height: 300px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-top: 10px;
}

.history-section {
  margin-top: 20px;
}

:deep(.el-textarea__inner) {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 14px;
}

:deep(.el-table .cell) {
  white-space: nowrap;
}
</style>
