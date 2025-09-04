import {BaseHttpClient} from "@/utils/request"

const http = new BaseHttpClient('/json');
export const getUserInfoApi = () => http.get<{
    code: number,
    data: UserInfos
}>('/user.json')