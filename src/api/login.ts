import {BaseHttpClient} from "@/utils/request"

const http = new BaseHttpClient('/json');
export const getAuthMenuListApi = () => http.get('/authMenuList.json'),
        getAuthButtonListApi = () => http.get('/authButtonList.json')