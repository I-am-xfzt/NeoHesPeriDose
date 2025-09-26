import { BaseHttpClient } from "@/utils/request";

const http = new BaseHttpClient("/");
export const getAuthMenuListApi = () =>
    http.get<HttpResType<Menu.MenuOptions[]>>("authMenuList"),
  getAuthButtonListApi = () => http.get("authButtonList");
