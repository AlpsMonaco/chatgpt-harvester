const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('node:path')
const express = require('express')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

current_dialogs = []

function jsonMessage(msg) {
  return { msg: msg }
}

function AppServer(sendMessage = (msg) => { console.log(msg) }, port = 3000) {
  const app = express()
  let server = null
  app.post("/send", jsonParser, function (req, res) {
    try {
      const msg = req.body.msg
      sendMessage(msg)
      res.json(jsonMessage('ok'))
    } catch (e) {
      console.error(e)
      res.status(400)
      res.json(jsonMessage("bad request"))
    }
  })
  app.get("/dialogs", function (req, res) {
    res.json({ dialogs: current_dialogs })
  })
  return {
    close: function () {
      if (server) server.close()
    },
    start: function () {
      server = app.listen(port)
    }
  }
}

function createMenu(window) {
  return Menu.buildFromTemplate(
    [
      {
        label: '选项',
        submenu: [
          {
            label: '打开控制台',
            click: () => { window.webContents.openDevTools() }
          },
          {
            label: '刷新',
            click: () => { window.reload() }
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
  ipcMain.on('receive-dialogs', (event, dialogs) => {
    current_dialogs = dialogs
  })
  mainWindow.webContents.session.setProxy({ proxyRules: "socks5://127.0.0.1:7890" })
    .then(() => { mainWindow.loadURL('https://chatgpt.com/') })

  let server = AppServer((msg) => {mainWindow.webContents.send('new-msg', msg)})
  server.start()
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
