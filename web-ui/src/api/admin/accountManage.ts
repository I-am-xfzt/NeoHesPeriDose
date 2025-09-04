import { BaseHttpClient } from "@/utils/request";
const http = new BaseHttpClient("/json");
export const pageList = (data: Object) => 
http.get<{
  code: number;
  data: [];
}>("/account.json");
