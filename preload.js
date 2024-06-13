const { ipcRenderer } = require('electron/renderer')

ipcRenderer.on('function-1', () => {
  document.body.innerHTML = ''
  ipcRenderer.send('set-title', '666')
})

const EVENT_OPTIONS = { bubbles: true, cancelable: false, composed: true };
const EVENTS = {
  BLUR: new Event("blur", EVENT_OPTIONS),
  CHANGE: new Event("change", EVENT_OPTIONS),
  INPUT: new Event("input", EVENT_OPTIONS),
};

ipcRenderer.on('new-msg', (sender, msg) => {
  const inputElement = document.querySelectorAll('textarea')[0]
  inputElement.value = msg;
  inputElement.dispatchEvent(EVENTS.INPUT);
  document.querySelectorAll('button')[document.querySelectorAll('button').length-2].click()
})

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function getDialogsTimer() {
  for (; ;) {
    await sleep(1000)
    var dialogs = []
    for (let o of document.querySelectorAll('p')) {
      dialogs.push(o.innerHTML)
    }
    ipcRenderer.send('receive-dialogs', dialogs)
  }
}

getDialogsTimer()