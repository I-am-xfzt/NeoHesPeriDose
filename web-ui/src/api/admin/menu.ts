import { BaseHttpClient } from "@/utils/request";

const http = new BaseHttpClient("/json");
export const pageList = async (): Promise<HttpResType<listResponse<Menu.MenuOptions>>> => {
  const { data } = await http.get<HttpResType<Menu.MenuOptions[]>>("/authMenuList.json");
  return {
    code: 200,
    data: {
      total: data.length,
      size: 10,
      current: 1,
      pages: 1,
      records: data
    },
    msg: "success"
  };
};
