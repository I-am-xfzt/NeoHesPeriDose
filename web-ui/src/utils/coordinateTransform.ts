/**
 * 坐标转换工具类
 * 支持 WGS84、GCJ02、BD09 等坐标系之间的相互转换
 */

// 坐标点接口定义
export interface Coordinate {
  lng: number;
  lat: number;
}

// 转换结果接口
export interface ConversionResult {
  success: boolean;
  data?: Coordinate;
  error?: string;
}

// 坐标系类型
export type CoordinateSystem = 'wgs84' | 'gcj02' | 'bd09';

// 常量定义
const PI = Math.PI;
const X_PI = (PI * 3000.0) / 180.0;
const A = 6378245.0; // 长半轴
const EE = 0.00669342162296594323; // 偏心率平方

/**
 * 判断坐标是否在中国境内
 * @param lng 经度
 * @param lat 纬度
 * @returns 是否在中国境内
 */
export function isInChina(lng: number, lat: number): boolean {
  return lng >= 72.004 && lng <= 137.8347 && lat >= 0.8293 && lat <= 55.8271;
}

/**
 * 坐标有效性验证
 * @param lng 经度
 * @param lat 纬度
 * @returns 验证结果
 */
export function validateCoordinate(lng: number, lat: number): boolean {
  return (
    typeof lng === 'number' &&
    typeof lat === 'number' &&
    !isNaN(lng) &&
    !isNaN(lat) &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
}

/**
 * 转换经度
 * @param lng 经度
 * @param lat 纬度
 * @returns 转换后的经度偏移量
 */
function transformLng(lng: number, lat: number): number {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
}

/**
 * 转换纬度
 * @param lng 经度
 * @param lat 纬度
 * @returns 转换后的纬度偏移量
 */
function transformLat(lng: number, lat: number): number {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}

/**
 * WGS84 转 GCJ02
 * @param lng WGS84经度
 * @param lat WGS84纬度
 * @returns GCJ02坐标
 */
export function wgs84ToGcj02(lng: number, lat: number): ConversionResult {
  if (!validateCoordinate(lng, lat)) {
    return { success: false, error: '无效的坐标值' };
  }

  if (!isInChina(lng, lat)) {
    return { success: true, data: { lng, lat } };
  }

  let dlat = transformLat(lng - 105.0, lat - 35.0);
  let dlng = transformLng(lng - 105.0, lat - 35.0);
  
  const radlat = (lat / 180.0) * PI;
  let magic = Math.sin(radlat);
  magic = 1 - EE * magic * magic;
  const sqrtmagic = Math.sqrt(magic);
  
  dlat = (dlat * 180.0) / (((A * (1 - EE)) / (magic * sqrtmagic)) * PI);
  dlng = (dlng * 180.0) / ((A / sqrtmagic) * Math.cos(radlat) * PI);
  
  const mglat = lat + dlat;
  const mglng = lng + dlng;
  
  return { success: true, data: { lng: mglng, lat: mglat } };
}

/**
 * GCJ02 转 WGS84
 * @param lng GCJ02经度
 * @param lat GCJ02纬度
 * @returns WGS84坐标
 */
export function gcj02ToWgs84(lng: number, lat: number): ConversionResult {
  if (!validateCoordinate(lng, lat)) {
    return { success: false, error: '无效的坐标值' };
  }

  if (!isInChina(lng, lat)) {
    return { success: true, data: { lng, lat } };
  }

  let dlat = transformLat(lng - 105.0, lat - 35.0);
  let dlng = transformLng(lng - 105.0, lat - 35.0);
  
  const radlat = (lat / 180.0) * PI;
  let magic = Math.sin(radlat);
  magic = 1 - EE * magic * magic;
  const sqrtmagic = Math.sqrt(magic);
  
  dlat = (dlat * 180.0) / (((A * (1 - EE)) / (magic * sqrtmagic)) * PI);
  dlng = (dlng * 180.0) / ((A / sqrtmagic) * Math.cos(radlat) * PI);
  
  const mglat = lat - dlat;
  const mglng = lng - dlng;
  
  return { success: true, data: { lng: mglng, lat: mglat } };
}

/**
 * GCJ02 转 BD09
 * @param lng GCJ02经度
 * @param lat GCJ02纬度
 * @returns BD09坐标
 */
export function gcj02ToBd09(lng: number, lat: number): ConversionResult {
  if (!validateCoordinate(lng, lat)) {
    return { success: false, error: '无效的坐标值' };
  }

  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * X_PI);
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * X_PI);
  
  const bd_lng = z * Math.cos(theta) + 0.0065;
  const bd_lat = z * Math.sin(theta) + 0.006;
  
  return { success: true, data: { lng: bd_lng, lat: bd_lat } };
}

/**
 * BD09 转 GCJ02
 * @param lng BD09经度
 * @param lat BD09纬度
 * @returns GCJ02坐标
 */
export function bd09ToGcj02(lng: number, lat: number): ConversionResult {
  if (!validateCoordinate(lng, lat)) {
    return { success: false, error: '无效的坐标值' };
  }

  const x = lng - 0.0065;
  const y = lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  
  const gcj_lng = z * Math.cos(theta);
  const gcj_lat = z * Math.sin(theta);
  
  return { success: true, data: { lng: gcj_lng, lat: gcj_lat } };
}

/**
 * WGS84 转 BD09
 * @param lng WGS84经度
 * @param lat WGS84纬度
 * @returns BD09坐标
 */
export function wgs84ToBd09(lng: number, lat: number): ConversionResult {
  const gcjResult = wgs84ToGcj02(lng, lat);
  if (!gcjResult.success || !gcjResult.data) {
    return gcjResult;
  }
  return gcj02ToBd09(gcjResult.data.lng, gcjResult.data.lat);
}

/**
 * BD09 转 WGS84
 * @param lng BD09经度
 * @param lat BD09纬度
 * @returns WGS84坐标
 */
export function bd09ToWgs84(lng: number, lat: number): ConversionResult {
  const gcjResult = bd09ToGcj02(lng, lat);
  if (!gcjResult.success || !gcjResult.data) {
    return gcjResult;
  }
  return gcj02ToWgs84(gcjResult.data.lng, gcjResult.data.lat);
}

/**
 * 通用坐标转换函数
 * @param lng 经度
 * @param lat 纬度
 * @param from 源坐标系
 * @param to 目标坐标系
 * @returns 转换结果
 */
export function coordinateConvert(
  lng: number,
  lat: number,
  from: CoordinateSystem,
  to: CoordinateSystem
): ConversionResult {
  if (from === to) {
    return { success: true, data: { lng, lat } };
  }

  const conversionMap = {
    'wgs84_gcj02': wgs84ToGcj02,
    'wgs84_bd09': wgs84ToBd09,
    'gcj02_wgs84': gcj02ToWgs84,
    'gcj02_bd09': gcj02ToBd09,
    'bd09_wgs84': bd09ToWgs84,
    'bd09_gcj02': bd09ToGcj02
  };

  const key = `${from}_${to}` as keyof typeof conversionMap;
  const convertFn = conversionMap[key];

  if (!convertFn) {
    return { success: false, error: `不支持从 ${from} 到 ${to} 的转换` };
  }

  return convertFn(lng, lat);
}

/**
 * 批量坐标转换
 * @param coordinates 坐标数组
 * @param from 源坐标系
 * @param to 目标坐标系
 * @returns 转换结果数组
 */
export function batchCoordinateConvert(
  coordinates: Coordinate[],
  from: CoordinateSystem,
  to: CoordinateSystem
): ConversionResult[] {
  return coordinates.map(coord => 
    coordinateConvert(coord.lng, coord.lat, from, to)
  );
}

/**
 * 解析坐标字符串
 * @param input 输入字符串
 * @returns 坐标数组
 */
export function parseCoordinates(input: string): Coordinate[] {
  if (!input || typeof input !== 'string') {
    return [];
  }

  const lines = input.trim().split(/[\r\n]+/);
  const coordinates: Coordinate[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // 支持多种分隔符：逗号、空格、制表符
    const parts = trimmedLine.split(/[,\s\t]+/).filter(part => part.length > 0);
    
    if (parts.length >= 2) {
      const lng = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);
      
      if (validateCoordinate(lng, lat)) {
        coordinates.push({ lng, lat });
      }
    }
  }

  return coordinates;
}

/**
 * 坐标格式化输出
 * @param coord 坐标对象
 * @param precision 精度，默认6位小数
 * @returns 格式化字符串
 */
export function formatCoordinate(coord: Coordinate, precision: number = 6): string {
  return `${coord.lng.toFixed(precision)}, ${coord.lat.toFixed(precision)}`;
}

/**
 * 计算两点之间的距离（米）
 * @param coord1 坐标1
 * @param coord2 坐标2
 * @returns 距离（米）
 */
export function calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371000; // 地球半径（米）
  const lat1Rad = (coord1.lat * PI) / 180;
  const lat2Rad = (coord2.lat * PI) / 180;
  const deltaLatRad = ((coord2.lat - coord1.lat) * PI) / 180;
  const deltaLngRad = ((coord2.lng - coord1.lng) * PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

/**
 * 导出为CSV格式
 * @param coordinates 坐标数组
 * @param headers 表头
 * @returns CSV字符串
 */
export function exportToCSV(coordinates: Coordinate[], headers: string[] = ['经度', '纬度']): string {
  const csvContent = [
    headers.join(','),
    ...coordinates.map(coord => `${coord.lng},${coord.lat}`)
  ].join('\n');
  
  return csvContent;
}

/**
 * 坐标系信息
 */
export const COORDINATE_SYSTEMS = {
  wgs84: {
    name: 'WGS84',
    description: '世界大地坐标系，GPS使用的坐标系',
    usage: '国际通用，GPS设备'
  },
  gcj02: {
    name: 'GCJ02',
    description: '国家测绘局坐标系，火星坐标系',
    usage: '高德地图、腾讯地图等'
  },
  bd09: {
    name: 'BD09',
    description: '百度坐标系',
    usage: '百度地图专用'
  }
} as const;