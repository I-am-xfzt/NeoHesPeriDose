import { BaseHttpClient } from "@/utils/request";

const http = new BaseHttpClient("/");
export const pageList = async (): Promise<HttpResType<listResponse<Menu.MenuOptions>>> => {
  const { data } = await http.get<HttpResType<Menu.MenuOptions[]>>("authMenuList");
  console.log(data, "data");
  
  return {
    code: 200,
    data: {
      total: data.length,
      size: 10,
      current: 1,
      pages: 1,
      data
    },
    msg: "success"
  };
};
