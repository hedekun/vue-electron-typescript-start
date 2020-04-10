import { BrowserWindow } from "electron";
import { mainWindow } from "../main";
import { Bounds } from "../types";

const trayWinURL =
  process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL as string}#about`
    : `app://./index.html#about`;

let trayWindow: BrowserWindow | null = null;

const createTrayWindow = function(bounds: Bounds) {
  if (trayWindow) return;

  trayWindow = new BrowserWindow({
    height: 350,
    width: 200,
    x: bounds.x,
    y: bounds.y - 310,
    show: false,
    frame: false,
    fullscreenable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    resizable: process.env.NODE_ENV === "development",
    // transparent: process.platform !== "linux",
    alwaysOnTop: true,
    skipTaskbar: true,
    parent: mainWindow as BrowserWindow,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      backgroundThrottling: false,
      devTools: false
    }
  });

  trayWindow.loadURL(trayWinURL);

  trayWindow.on("blur", () => {
    if (trayWindow) {
      trayWindow.hide();
    }
  });

  trayWindow.on("closed", () => {
    trayWindow = null;
  });
  return trayWindow;
};

export { createTrayWindow, trayWindow };
