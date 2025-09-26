
import { getDicts, dictData } from "./dicts";
import { BaseHttpClient } from "@/utils/request";
const http = new BaseHttpClient('/dict')
export const pageList = (data: EmptyObjectType) => http.get<HttpResType<listResponse<dictData>>>(`/${data.dict}`, data);