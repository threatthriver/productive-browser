"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const isDevelopment = process.env.NODE_ENV !== 'production';
let mainWindow = null;
async function createWindow() {
    // Create the browser window
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true,
            preload: path_1.default.join(__dirname, 'preload.js')
        }
    });
    // Load the app
    if (isDevelopment) {
        try {
            // In development, load from the Vite dev server
            await mainWindow.loadURL('http://localhost:4002');
        }
        catch (error) {
            console.error('Failed to load development server:', error);
        }
    }
    else {
        // In production, load the built files
        await mainWindow.loadFile(path_1.default.join(__dirname, '../dist/index.html'));
    }
    // Emitted when the window is closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    // Only show when ready to avoid white flashes
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
        if (isDevelopment) {
            mainWindow?.webContents.openDevTools({ mode: 'detach' });
        }
    });
    // Open external links in default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http:') || url.startsWith('https:')) {
            const { shell } = require('electron');
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });
}
// This method will be called when Electron has finished initialization
electron_1.app.whenReady().then(() => {
    createWindow();
    // On macOS it's common to re-create a window when the dock icon is clicked
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
// Quit when all windows are closed, except on macOS
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Simple IPC handler for app version
electron_1.ipcMain.handle('get-app-version', () => {
    return electron_1.app.getVersion();
});
//# sourceMappingURL=main.js.map