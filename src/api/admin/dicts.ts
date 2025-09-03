import { BaseHttpClient } from "@/utils/request";
const http = new BaseHttpClient("/json");
export interface dictData {
  id: string;
  dictId: string;
  label: string;
  dictType: string;
  description: themeType;
  sortOrder: number;
  createTime: string;
  value: string;
}
export const getDicts = (dict: string) => http.get<HttpResType<dictData>>(`/dict/${dict}.json`);
