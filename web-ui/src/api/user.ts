import {BaseHttpClient} from "@/utils/request"

const http = new BaseHttpClient('/');
export const getUserInfoApi = () => http.get<{
    code: number,
    data: UserInfos
}>('user')