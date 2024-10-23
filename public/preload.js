// public/preload.js

const { contextBridge, ipcRenderer } = require('electron');

// Экспортируем API для взаимодействия через IPC
contextBridge.exposeInMainWorld('electronAPI', {
  searchFiles: (folderName, searchTerm) => ipcRenderer.invoke('search-files', folderName, searchTerm),
  openFile: (folderName, fileName) => ipcRenderer.invoke('open-file', folderName, fileName),
});
