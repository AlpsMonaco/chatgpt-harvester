const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('node:path')

function createMenu(window) {
  return Menu.buildFromTemplate(
    [
      {
        label: '选项',
        submenu: [
          {
            label: '打开控制台',
            click: function () {
              window.webContents.openDevTools()
            }
          },
          {
            label: '刷新',
            click: function () {
              window.reload()
            }
          },
          {
            click: () => window.webContents.send('function-1', 1),
            label: 'function-1'
          },
        ]
      }
    ])
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  const menu = createMenu(mainWindow)
  mainWindow.setMenu(menu)
  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })
  mainWindow.webContents.session.setProxy({ proxyRules: "socks5://127.0.0.1:7890" })
    .then(() => { mainWindow.loadURL('https://chatgpt.com/') })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
