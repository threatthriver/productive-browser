import { contextBridge, ipcRenderer } from 'electron';

// Minimal preload script
try {
  contextBridge.exposeInMainWorld('electron', {
    getAppVersion: () => ipcRenderer.invoke('get-app-version')
  });
} catch (error) {
  console.error('Failed to expose electron API:', error);
}
