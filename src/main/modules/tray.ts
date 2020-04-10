import { screen, Tray } from "electron";
import { imagePath, mainWindow } from "../main";
const isDevelopment = process.env.NODE_ENV !== "production";
import { trayWindow } from "../window/trayWindow";

const createTray = function() {
  const { width: screenWidth } = screen.getPrimaryDisplay().size;
  const trayIconPath: string = isDevelopment
    ? "public/images/logo.png"
    : imagePath("logo.png");
  const appTray: Tray = new Tray(trayIconPath);
  appTray.setToolTip("Vue-Electron-TypeScript-Starter");
  appTray.on("right-click", () => {
    if (trayWindow) {
      const [trayMenuWidth, trayMenuHeight] = trayWindow.getSize();
      const { x, y } = screen.getCursorScreenPoint();
      if (x + trayMenuWidth > screenWidth) {
        trayWindow.setPosition(x - trayMenuWidth, y - trayMenuHeight);
      } else {
        trayWindow.setPosition(x, y - trayMenuHeight);
      }
      trayWindow.show();
    }
  });
  appTray.on("click", () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.show();
      } else {
        mainWindow.hide();
      }
    }
  });
  return appTray;
};

export default createTray;
