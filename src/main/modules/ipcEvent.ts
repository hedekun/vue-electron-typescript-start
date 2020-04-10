import { ipcMain, app, BrowserWindow } from "electron";

export default function() {
  ipcMain.on("app-exit", () => {
    // 所有窗口都将立即被关闭，而不询问用户，而且 before-quit 和 will-quit 事件也不会被触发。
    app.exit();
  });

  ipcMain.on("window-close", () => {
    const wins = BrowserWindow.getAllWindows();
    for (let i = 0; i < wins.length; i++) {
      wins[i].close();
    }
  });
}
