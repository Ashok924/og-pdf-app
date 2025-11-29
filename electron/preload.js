const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
    // Add any APIs you want to expose to the renderer process here
    platform: process.platform,
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron,
    },
    // Example: File operations
    // readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    // writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
});
