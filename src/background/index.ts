chrome.runtime.onInstalled.addListener(async (opt) => {
  if (opt.reason === 'install') {
    chrome.tabs.create({
      active: true,
      url: chrome.runtime.getURL('./src/setup/install.html'),
    })
  }

  if (opt.reason === 'update') {
    // un-comment to display update page
    // disabled for development
    // chrome.tabs.create({
    //   active: true,
    //   url: chrome.runtime.getURL('./src/setup/update.html'),
    // })
  }
})

console.log('hello world from background')

self.onerror = function (message, source, lineno, colno, error) {
  console.info(
    `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
  )
}

export {}
