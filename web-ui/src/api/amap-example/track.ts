import { BaseHttpClient } from "@/utils/request";
export interface TrackPoint {
	/**
	 * GPS时间(yyyy-MM-dd HH:mm:ss.SSS)
	 */
	gpsTime: string;
	/**
	 * 纬度
	 */
	latitude: string;
	/**
	 * 经度
	 */
	longitude: string;
	/**
	 * 里程(km)
	 */
	mileage: string;
	/**
	 * 速度(km/h)
	 */
	speed: string;
    /**
     * 地址
     */
    address?: string;
}
const http = new BaseHttpClient("/");
export const pageList = () => http.get<HttpResType<TrackPoint[]>>("track");