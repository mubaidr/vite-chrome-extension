function sendLogToBackground(data) {
  chrome.runtime.sendMessage({
    type: 'CONSOLE_LOG',
    data,
  })
}
