import { BaseHttpClient } from "@/utils/request";
const http = new BaseHttpClient("/");
export const pageList = (data: Object) => 
http.get<HttpResType<listResponse<EmptyObjectType>>>("account", data);
