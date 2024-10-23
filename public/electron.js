// public/electron.js

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Ловим событие от рендера (React) для поиска файлов
ipcMain.handle('search-files', async (event, folderName, searchTerm) => {
  const baseDir = 'C:\\Users\\Alexe\\Documents\\TestForMPK';
  const folderPath = path.join(baseDir, folderName, 'Mittaukset');

  if (!fs.existsSync(folderPath)) {
    return [`Папка "${folderName}" не найдена`];
  }

  const files = fs.readdirSync(folderPath);
  const excelFiles = files.filter(file => file.endsWith('.xlsx') || file.endsWith('.xls'));

  const filteredFiles = searchTerm
    ? excelFiles.filter(file => file.toLowerCase().includes(searchTerm.toLowerCase()))
    : excelFiles;

  return filteredFiles.length > 0 ? filteredFiles : ['Файлы не найдены.'];
});

// Открытие файла через shell
ipcMain.handle('open-file', async (event, folderName, fileName) => {
  const baseDir = 'C:\\Users\\Alexe\\Documents\\TestForMPK';
  const filePath = path.join(baseDir, folderName, 'Mittaukset', fileName);

  // Проверяем, существует ли файл перед открытием
  if (fs.existsSync(filePath)) {
    await shell.openPath(filePath);
  } else {
    return `Файл ${fileName} не найден.`;
  }
});
