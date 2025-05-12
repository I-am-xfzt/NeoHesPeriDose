import { App, Directive } from "vue";
import copy from "./modules/copy";
import waterMarker from "./modules/waterMarker";
import draggable from "./modules/draggable";
import debounce from "./modules/debounce";
import throttle from "./modules/throttle";
import longpress from "./modules/longpress";
import chartLoading from "./modules/chartLoading"
import resizeOb from "./modules/resizeOb";
const directivesList: { EmptyObjectType<Directive> } = {
  copy,
  waterMarker,
  draggable,
  debounce,
  throttle,
  longpress,
  resizeOb,
  chartLoading
};

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach(key => {
      app.directive(key, directivesList[key]);
    });
  }
};

export default directives;
