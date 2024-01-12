// redirect logs to background script
window.console.log = (...data) => {
  chrome.runtime.sendMessage({
    type: 'CONSOLE_LOG',
    data,
  })
}

console.log('console log from offscreen document')

self.onerror = function (message, source, lineno, colno, error) {
  console.info(
    `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
  )
}
