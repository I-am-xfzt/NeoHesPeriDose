import { ref, nextTick } from "vue";
export const usePageTools = () => {
  const elMenuHorizontalScrollRef = ref();
  // 设置横向滚动条可以鼠标滚轮滚动
  const onElMenuHorizontalScroll = (e: WheelEventType) => {
    const eventDelta = e.wheelDelta || -e.deltaY * 40;
    elMenuHorizontalScrollRef.value.$refs.wrapRef.scrollLeft =
      elMenuHorizontalScrollRef.value.$refs.wrapRef.scrollLeft + eventDelta / 4;
  };
  // 初始化数据，页面刷新时，滚动条滚动到对应位置
  const initElMenuOffsetLeft = (ele: string = ".el-menu.el-menu--horizontal li.is-active") => {
    nextTick(() => {
      let els = <HTMLElement>document.querySelector(ele);
      if (!els) return false;
      elMenuHorizontalScrollRef.value.$refs.wrapRef.scrollLeft = els.offsetLeft;
    });
  };
  return {
    initElMenuOffsetLeft,
    onElMenuHorizontalScroll
  };
};
