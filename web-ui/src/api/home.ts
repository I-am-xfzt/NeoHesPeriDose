import { BaseHttpClient } from "@/utils/request";
export interface theDataRes {
    date: string;
    production: number;
}
const http = new BaseHttpClient("/json");
export const getStatisticsApi = () => http.get<HttpResType<theDataRes[]>>("/home_statistics.json");
