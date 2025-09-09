import piniaPersistConfig from "../helper/persist";
import { defineStore } from "pinia";

interface coordinateInfoState {
  historyRecord: Array<coordinateInfoType>;
}
export const useCoordinateTransitionStore = defineStore("coordinateTransition", {
  state: (): coordinateInfoState => ({
    historyRecord: []
  }),
  actions: {
    setHistoryRecord(data: coordinateInfoType) {
      this.historyRecord.unshift(data);
    },
    deleteRecord(id: string) {
      this.historyRecord = this.historyRecord.filter((v: coordinateInfoType) => v.id != id);
    }
  },
  persist: piniaPersistConfig("neohesperidose-coordinate-transition")
});
