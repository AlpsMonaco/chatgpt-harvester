const { ipcRenderer } = require('electron/renderer')

ipcRenderer.on('function-1', () => {
  document.body.innerHTML = ''
  ipcRenderer.send('set-title', '666')
})