<template>
  <div class="coordinate-converter">
    <el-card class="converter-card">
      <template #header>
        <div class="card-header">
          <h2>坐标转换工具</h2>
          <el-tag type="info">支持 WGS84、GCJ02、BD09 坐标系互转</el-tag>
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
          <el-table-column prop="source" label="源坐标" width="200">
            <template #default="{ row }">
              {{ formatCoordinate(row.source) }}
            </template>
          </el-table-column>
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
      <el-divider />

      <div class="history-section">
        <h3>历史记录</h3>
        <fyh-table :data="history" :module-path="modulePath"></fyh-table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ElMessage, ElNotification, ElDivider } from "element-plus";
import { Refresh, Delete, QuestionFilled, DocumentCopy } from "@element-plus/icons-vue";
import FyhForm from "@/components/FyhComs/FyhForm.vue";
import FyhTable from "@/components/FyhComs/FyhTable.vue";
const modulePath = "views/assembly/coordinateTransition";
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
  // 这里使用模拟转换，实际项目需要实现正确的转换算法
  const mockOffset = {
    wgs84_to_gcj02: { lng: 0.01, lat: 0.01 },
    wgs84_to_bd09: { lng: 0.02, lat: 0.02 },
    gcj02_to_wgs84: { lng: -0.01, lat: -0.01 },
    gcj02_to_bd09: { lng: 0.01, lat: 0.01 },
    bd09_to_wgs84: { lng: -0.02, lat: -0.02 },
    bd09_to_gcj02: { lng: -0.01, lat: -0.01 }
  };

  const key = `${from}_to_${to}`;
  const offset = mockOffset[key] || { lng: 0, lat: 0 };

  return {
    lng: parseFloat((lng + offset.lng).toFixed(6)),
    lat: parseFloat((lat + offset.lat).toFixed(6))
  };
};

// 解析输入坐标
const parseCoordinates = input => {
  const coordinates = [];

  // 尝试解析多种格式
  try {
    // JSON数组格式
    if (input.trim().startsWith("[")) {
      const jsonData = JSON.parse(input);
      jsonData.forEach(item => {
        if (item.lng && item.lat) {
          coordinates.push({ lng: parseFloat(item.lng), lat: parseFloat(item.lat) });
        }
      });
    } else {
      // 文本格式：经度,纬度;经度,纬度
      const points = input.split(";").filter(Boolean);
      points.forEach(point => {
        const [lng, lat] = point.split(",").map(coord => parseFloat(coord.trim()));
        if (!isNaN(lng) && !isNaN(lat)) {
          coordinates.push({ lng, lat });
        }
      });
    }
  } catch (error) {
    throw new Error("坐标格式解析错误，请检查输入格式");
  }

  if (coordinates.length === 0) {
    throw new Error("未找到有效的坐标数据");
  }

  return coordinates;
};

// 处理转换
const handleConvert = async () => {
  if (!form.inputCoordinates.trim()) {
    ElMessage.warning("请输入坐标数据");
    return;
  }

  if (form.sourceSystem === form.targetSystem) {
    ElMessage.warning("源坐标系和目标坐标系不能相同");
    return;
  }

  converting.value = true;
  errorMessage.value = "";

  try {
    const inputCoords = parseCoordinates(form.inputCoordinates);
    const convertedResult = inputCoords.map(coord => {
      const converted = coordinateConvert(coord.lng, coord.lat, form.sourceSystem, form.targetSystem);
      return {
        source: coord,
        target: converted
      };
    });

    result.value = convertedResult;

    // 保存到历史记录
    saveToHistory(inputCoords.length);

    // 初始化地图
    await nextTick();
    initMap(convertedResult.map(item => item.target));

    ElMessage.success(`成功转换 ${inputCoords.length} 个坐标点`);
  } catch (error) {
    errorMessage.value = error.message;
    ElMessage.error(error.message);
  } finally {
    converting.value = false;
  }
};

// 初始化地图
const initMap = coordinates => {
  if (!mapContainer.value) return;

  // 清空地图容器
  mapContainer.value.innerHTML = "";

  // 这里使用简单的div模拟地图，实际项目可以集成Leaflet或OpenLayers
  const mapDiv = document.createElement("div");
  mapDiv.style.height = "300px";
  mapDiv.style.backgroundColor = "#f0f9ff";
  mapDiv.style.border = "1px solid #ccc";
  mapDiv.style.borderRadius = "4px";
  mapDiv.style.padding = "10px";
  mapDiv.innerHTML = `
    <div style="text-align: center; margin-top: 120px; color: #666;">
      <h3>地图预览</h3>
      <p>实际项目中可集成 Leaflet 或 OpenLayers</p>
      <p>转换了 ${coordinates.length} 个坐标点</p>
      <p>示例坐标: ${coordinates[0].lng.toFixed(6)}, ${coordinates[0].lat.toFixed(6)}</p>
    </div>
  `;

  mapContainer.value.appendChild(mapDiv);
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
