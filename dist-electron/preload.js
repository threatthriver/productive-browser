"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
// Minimal preload script
try {
    electron_1.contextBridge.exposeInMainWorld('electron', {
        getAppVersion: function () { return electron_1.ipcRenderer.invoke('get-app-version'); }
    });
}
catch (error) {
    console.error('Failed to expose electron API:', error);
}
