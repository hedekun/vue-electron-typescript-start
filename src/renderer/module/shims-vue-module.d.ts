import Vue from "vue";
import VueRouter from "vue-router";
import { Route } from "vue-router";
import { IpcRenderer, Remote } from "electron";

/**
 * 声明文件拓展
 */
declare module "vue/types/vue" {
  interface Vue {
    $router: VueRouter;
    $route: Route;
    $electron: {
      ipcRenderer: IpcRenderer;
      remote: Remote;
    };
  }
}
