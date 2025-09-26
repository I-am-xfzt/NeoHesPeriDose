import { BaseHttpClient } from "@/utils/request";
const http = new BaseHttpClient("/dict");
export interface dictData {
  label: string;
  dictType: string;
  description: themeType;
  value: string;
}
export const getDicts = (dict: string) => http.get<HttpResType<dictData[]>>(`/${dict}`);
