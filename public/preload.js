// This script runs in the renderer process and sets up the context bridge
document.addEventListener('DOMContentLoaded', () => {
  // Set up any required overrides or polyfills here
});

// Expose a safe API to the renderer process
const { contextBridge, ipcRenderer } = require('electron');

// Expose a safe API to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // Example: Expose a method to get app version
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Example: Expose a method to open external links in default browser
  openExternal: (url) => {
    if (typeof url === 'string' && url.startsWith('http')) {
      ipcRenderer.send('open-external', url);
    }
  },
  
  // Add more safe methods as needed
});
