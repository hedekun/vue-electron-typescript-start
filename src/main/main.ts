import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import path from "path";
import InitIpcEvent from "./modules/ipcEvent";
import createTray from "./modules/tray";
import { createTrayWindow } from "./window/trayWindow";
import { Bounds } from "./types";

const isDevelopment = process.env.NODE_ENV !== "production";
// 获取图片路径
const imagePath = function(pathName: string) {
  return path.join(__dirname, `./images/${pathName}`);
};
const iconPath: string = isDevelopment
  ? "public/images/logo.png"
  : imagePath("logo.png");
// // 全局的browWindow
let mainWindow: BrowserWindow | null;
// 全局的托盤
// eslint-disable-next-line
let tray: any;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    minWidth: 800,
    minHeight: 800,
    title: "vue-electron",
    icon: iconPath,
    // windows导航栏，false为隐藏
    frame: true,
    // MacOS隐藏导航栏
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: false,
      navigateOnDragDrop: true,
      devTools: true
    }
  });

  // 去除原生顶部菜单栏
  mainWindow.setMenu(null);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development moder
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    mainWindow.loadURL("app://./index.html");
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.on("close", event => {
    event.preventDefault();
    if (mainWindow) {
      // 通知渲染页面即将关闭窗口
      mainWindow.webContents.send("will-close");
    }
  });

  mainWindow.once("ready-to-show", () => {
    if (mainWindow !== null) {
      mainWindow.show();
    }
  });

  // 注册main ipc
  InitIpcEvent();

  // 如果是windows系统模拟托盘菜单
  if (process.platform === "win32") {
    tray = createTray();
    const trayBounds: Bounds = tray.getBounds();
    createTrayWindow(trayBounds);
  }
}

// Quit when all window are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other window open.
  if (mainWindow === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // eslint-disable-next-line
      const extensions: any = BrowserWindow.getDevToolsExtensions();
      if (!extensions["Vue.js devtools"]) {
        BrowserWindow.addDevToolsExtension(
          path.resolve(__dirname, "../src/main/vue-devtools")
        );
      }
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

export { mainWindow, imagePath };
