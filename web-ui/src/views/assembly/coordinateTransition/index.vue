<template>
  <div class="coordinate-converter">
    <el-card class="converter-card">
      <template #header>
        <div class="card-header">
          <h2>坐标转换工具</h2>
          <el-tag type="primary">支持 WGS84、GCJ02、BD09 坐标系互转</el-tag>
        </div>
      </template>
      <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon closable @close="errorMessage = ''" />
      <fyh-form v-model="form" :module-path="modulePath"></fyh-form>
      <div v-if="result.length > 0">
        <div class="result-header">
          <h3>转换结果</h3>
          <el-button type="success" @click="handleCopyResult">
            <el-icon><DocumentCopy /></el-icon>
            复制结果
          </el-button>
        </div>

        <el-table :data="result" stripe style="width: 100%">
          <el-table-column prop="target" label="目标坐标" width="200">
            <template #default="{ row }">
              {{ formatCoordinate(row.target) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button size="small" @click="copySingleCoordinate(row.target)"> 复制 </el-button>
            </template>
          </el-table-column>
        </el-table>

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

<script setup>
import { ElMessage, ElNotification, ElDivider } from "element-plus";
import { Refresh, Delete, QuestionFilled, DocumentCopy } from "@element-plus/icons-vue";
import { useCoordinateTransitionStore } from "@/stores/business/coordinateTransition";
import FyhForm from "@/components/FyhComs/FyhForm.vue";
import FyhTable from "@/components/FyhComs/FyhTable.vue";
const modulePath = "views/assembly/coordinateTransition";
const useCoordStore = useCoordinateTransitionStore();
const { historyRecord, setHistoryRecord, deleteRecord } = storeToRefs(useCoordStore)
// 表单数据
const form = reactive({
  sourceSystem: "wgs84",
  targetSystem: "gcj02",
  inputCoordinates: ""
});

const converting = ref(false);
const errorMessage = ref("");
const result = ref([]);
const history = ref([]);
const mapContainer = ref(null);

// 坐标转换函数（简化版，实际使用时需要实现完整的转换算法）
const coordinateConvert = (lng, lat, from, to) => {
  
};

// 解析输入坐标
const parseCoordinates = input => {

};

// 处理转换
const handleConvert = async () => {
  try {
    
  } catch (error) {
    errorMessage.value = error.message;
    ElMessage.error(error.message);
  } finally {
    converting.value = false;
  }
};

// 初始化地图
const initMap = coordinates => {

};

// 保存到历史记录
const saveToHistory = pointCount => {
  history.value.unshift({
    time: new Date().toLocaleString(),
    from: form.sourceSystem.toUpperCase(),
    to: form.targetSystem.toUpperCase(),
    count: pointCount,
    input: form.inputCoordinates,
    result: result.value
  });

  // 只保留最近10条记录
  if (history.value.length > 10) {
    history.value = history.value.slice(0, 10);
  }
};

// 加载历史记录
const loadHistory = record => {
  form.inputCoordinates = record.input;
  result.value = record.result;
  ElMessage.success("历史记录已加载");
};

// 复制结果
const handleCopyResult = async () => {
  const text = result.value.map(item => `${item.target.lng.toFixed(6)},${item.target.lat.toFixed(6)}`).join("\n");

  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success("结果已复制到剪贴板");
  } catch (error) {
    ElMessage.error("复制失败，请手动复制");
  }
};

// 复制单个坐标
const copySingleCoordinate = async coord => {
  const text = `${coord.lng.toFixed(6)},${coord.lat.toFixed(6)}`;
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success("坐标已复制");
  } catch (error) {
    ElMessage.error("复制失败");
  }
};

// 清空输入
const handleClear = () => {
  form.inputCoordinates = "";
  result.value = [];
  errorMessage.value = "";
};

// 加载示例
const handleExample = () => {
  form.inputCoordinates = `116.397428,39.90923
121.472644,31.231706
113.264385,23.129112`;
  ElMessage.info("示例数据已加载");
};

// 格式化坐标显示
const formatCoordinate = coord => {
  return `${coord.lng.toFixed(6)}, ${coord.lat.toFixed(6)}`;
};

onMounted(() => {
  // 初始化时可以加载一些示例或默认设置
});
</script>

<style scoped>
.coordinate-converter {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.converter-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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
