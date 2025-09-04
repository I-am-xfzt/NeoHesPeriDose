import { defineStore } from "pinia";
import piniaPersistConfig from "@/stores/helper/persist";
import { getUserInfoApi } from "@/api/user";
import { Session } from "@/utils/storage";
const getUserInfos = (): UserInfos => ({
  name: "",
  userName: "",
  deptId: null,
  deptName: "",
  roleName: "",
  area: null,
  rolesArr: [],
  roles: [],
  dept: {},
  userId: undefined,
  phonenumber: "",
  signUrl: ""
});
export const useUserStore = defineStore("neohesperidose-user", {
  state: (): UserState => ({
    token: "",
    userInfo: getUserInfos()
  }),
  getters: {},
  actions: {
    // Set Token
    setToken() {
      this.token = Session.getToken();
    },
    // Set setUserInfo
    async setUserInfo() {
      const { code, data } = await getUserInfoApi();
      if (code === 200) {
        Object.assign(this.userInfo, data);
      }
    },
    clearToken() {
      this.token = "";
      Session.remove("token");
    },
    clearUserInfo() {
      this.userInfo = getUserInfos();
    },
    loginOut(callback: Function){
      this.clearToken();
      this.clearUserInfo();
      callback()
    }
  },
  persist: piniaPersistConfig("neohesperidose-user")
});
