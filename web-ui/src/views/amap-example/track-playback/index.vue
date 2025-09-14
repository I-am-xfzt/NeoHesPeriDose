<script setup name="track-playback" lang="ts">
import trachImg from "@/assets/images/trach.png";
import amapContainer from "@/components/aMapContainer/index.vue";
import { pageList, TrackPoint } from "@/api/amap-example/track";
import { getTimeDifference, formatDateTime } from "../../../utils/formatTime";
const showInfoRef = ref<HTMLDivElement>();
const showEndRef = ref<HTMLDivElement>();
const startSvg = ref<HTMLDivElement>();
const endSvg = ref<HTMLDivElement>();
const route = useRoute();
const plugins: string[] = ["AMap.MoveAnimation", "AMap.Scale", "AMap.Geocoder", "AMap.ToolBar"];
const amapContainerRef = ref<InstanceType<typeof amapContainer>>();
const amapMethos = ref({});
const loading = ref<boolean>(true);
const state = reactive({
  marker: undefined as any,
  polyline: undefined,
  passedPolyline: undefined
});
const calculateDurations = (
    points: TrackPoint[]
  ): Array<{
    autoRotation: boolean;
    position: [number, number];
  }> => {
    // 计算中间点的duration（使用map和slice避免修改原数组）
    return points
      .filter(v => Number(v.speed) > 0 && Number(v.mileage) > 0)
      .map((point, index, arr) => {
        const position: [number, number] = [Number(point.longitude), Number(point.latitude)];
        if (index === arr.length - 1) {
          return {
            position,
            // duration: 500,
            autoRotation: true
          };
        }
        const nextPoint = arr[index + 1];
        // const distance = Number(nextPoint.mileage) - Number(point.mileage);
        // const duration = (distance / Number(point.speed)) * 3600000;
        return { position, autoRotation: true }; // 返回新对象保持不可变性
      });
  },
  addAmapControl = (amap: any, instance: any, options: EmptyObjectType) => {
    for (const amapKey in options) {
      instance.addControl(new amap[amapKey](options[amapKey]));
    }
  };
const speedMultiplier = ref<number | undefined>(1);
const moveAlogState = reactive({
  duration: 1000
});
// 逆地理编码：根据经纬度获取详细地址
const geocAddress = (lnglat: any, AMap: any, index: number) => {
  const geocoder = new AMap.Geocoder();
  geocoder.getAddress(lnglat, (status: string, result: any) => {
    if (status === "complete" && result.regeocode) {
      const { township, street, streetNumber, province, city, district } = result.regeocode.addressComponent;
      trackList.value[index].address = `${city}${district}${township}${street}${streetNumber}`;
    }
  });
};
const trackList = ref<TrackPoint[]>([]);
const getAmapInstance = async ({ mapSetCenter, theAmapLoader, AmapInstance }: THEAMAPSTATETYPE) => {
  debugger;
  addAmapControl(theAmapLoader, AmapInstance, {
    Scale: {
      position: "LB",
      offset: [10, 10]
    },
    ToolBar: {
      position: "RT",
      offset: [20, 60]
    }
  });
  loading.value = true;
  const { data: mapData } = await pageList();
  console.log(mapData);

  amapMethos.value = {
    mapSetCenter: mapSetCenter,
    AmapLoader: theAmapLoader,
    AMapInstance: AmapInstance
  };
  trackList.value = mapData.filter((v: EmptyObjectType) => v.longitude && v.latitude);
  moveAlogState.duration = 1000 / mapData.length;
  const pathData = trackList.value.map((m: EmptyObjectType) => [Number(m.longitude), Number(m.latitude)]);
  geocAddress(pathData.at(-1), theAmapLoader, trackList.value.length - 1);
  const start = new theAmapLoader.Marker({
    map: AmapInstance,
    position: pathData[0],
    content: startSvg.value,
    offset: new theAmapLoader.Pixel(0, 0)
  });
  const end = new theAmapLoader.Marker({
    map: AmapInstance,
    position: pathData.at(-1),
    content: endSvg.value,
    offset: new theAmapLoader.Pixel(0, 0)
  });
  geocAddress(pathData[0], theAmapLoader, 0);
  const InfoWindow = new theAmapLoader.Marker({
    map: AmapInstance,
    position: pathData[0],
    offset: new theAmapLoader.Pixel(-100, -80),
    content: showInfoRef.value,
    zIndex: 3
  });
  const InfoWindowEnd = new theAmapLoader.Marker({
    position: pathData.at(-1),
    map: AmapInstance,
    offset: new theAmapLoader.Pixel(-100, -110),
    content: showEndRef.value,
    zIndex: 3
  });
  state.marker = new theAmapLoader.Marker({
    map: AmapInstance,
    position: pathData[0],
    icon: new theAmapLoader.Icon({
      size: new theAmapLoader.Size(48, 48),
      image: trachImg, // Icon的图像
      imageOffset: new theAmapLoader.Pixel(-13, 10), // 图像相对展示区域的偏移量，适于雪碧图等
      imageSize: new theAmapLoader.Size(48, 48)
    }),
    offset: new theAmapLoader.Pixel(-13, -26)
  });
  // 绘制轨迹
  state.polyline = new theAmapLoader.Polyline({
    map: AmapInstance,
    path: pathData,
    showDir: true,
    strokeColor: "#28F", //线颜色
    // strokeOpacity: 1,     //线透明度
    strokeWeight: 10 //线宽
    // strokeStyle: "solid"  //线样式
  });
  state.passedPolyline = new theAmapLoader.Polyline({
    map: AmapInstance,
    strokeColor: "#AF5", //线颜色
    strokeWeight: 10 //线宽
  });
  state.marker!.on("moving", function (e: any) {
    state.passedPolyline!.setPath(e.passedPath);
    // mapSetCenter(e.target.getPosition(), true)
    // InfoWindow.open(AmapInstance, e.target.getPosition())
  });
  AmapInstance.setFitView();
  loading.value = false;
  AmapInstance.setZoom(12);
  setTimeout(() => state.marker!.moveAlong(calculateDurations(trackList.value), moveAlogState), 2000);
};
// 开始动画-->
const startAnimation = () => {
  if (state.marker) {
  }
};
// 暂停动画
const pauseAnimation = () => {
  if (state.marker) {
    state.marker.pauseMove();
  }
};

// 继续动画
const resumeAnimation = () => {
  if (state.marker) {
    state.marker.resumeMove();
  }
};
// 停止动画
const stopAnimation = () => {
  if (state.marker) {
    state.marker.stopMove();
  }
};
</script>

<template>
  <div class="vehicke-trajectory wh100">
    <amapContainer
      v-chartLoading="{ loading: loading, time: 1000 }"
      :custom-fun="getAmapInstance"
      ref="amapContainerRef"
      :plugins="plugins"
      :zoom="20"
      viewMode="2D"
      map-style="darkblue"
    >
      <div v-show="trackList.length > 0">
        <div class="showinfo FlexBox flex-column" ref="showInfoRef">
          <div class="YouSheBiaoTiHei w100" :title="trackList[0]?.address">{{ trackList[0]?.address }}</div>
          <div class="info">开始时间： {{ formatDateTime(trackList[0]?.gpsTime!, "yyyy-MM-dd hh:mm:ss") }}</div>
        </div>
        <div class="showinfo flex-column FlexBox" ref="showEndRef">
          <div class="YouSheBiaoTiHei w100" :title="trackList.at(-1)?.address">{{ trackList.at(-1)?.address }}</div>
          <div class="info">结束时间： {{ formatDateTime(trackList.at(-1)?.gpsTime!, "yyyy-MM-dd hh:mm:ss") }}</div>
          <div class="info">运输时长：{{ getTimeDifference(trackList.at(-1)?.gpsTime!, trackList[0]?.gpsTime!).formatted }}</div>
        </div>
        <div ref="startSvg" class="svgDiv FlexBox s-row-center" style="width: 30px; height: 30px; background: #1662f3">起</div>
        <div ref="endSvg" class="svgDiv FlexBox s-row-center" style="width: 30px; height: 30px; background: #52cb23">终</div>
      </div>
    </amapContainer>
  </div>
</template>

<style scoped lang="scss">
.vehicke-trajectory {
  position: relative;
  z-index: 99;
}

:deep(.amap-scalecontrol) {
  background: var(--el-fill-color-blank);
  color: white;

  .amap-scale-text {
    padding: 3px 6px;
  }

  .amap-scale-line {
    padding-bottom: 3px;

    & > div {
      background: #1c61d8 !important;
    }
  }
}
.svgDiv {
  border-radius: 50%;
  border: 3px solid white;
  color: white;
  font-size: 14px;
}
.showinfo {
  width: 240px;
  padding: 10px 10px 25px 10px;
  background: url("@/assets/images/showcarinfo.png") no-repeat;
  background-size: 100% 100%;
  color: white;
  font-size: 12px;
  .YouSheBiaoTiHei {
    padding: 10px;
    padding-bottom: 5px !important;
    font-size: 14px;
    text-align: center;
    line-height: 1.1;
  }
  .info {
    width: 80%;
    text-align: left;
    margin-bottom: 5px;
  }
}
</style>
