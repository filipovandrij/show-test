export const executeNewTab = async (
  tabId: number,
  files = ['./static/js/content.js', './static/js/messageBus.js']
) => {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: {
          tabId,
        },
        files,
      },
      (results) => {
        if (results[0] === null) {
          reject(new Error('Failed to parse.'))
        } else {
          resolve(results[0])
        }
      }
    )
  })
}
