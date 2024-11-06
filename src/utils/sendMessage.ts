/**
 * @deprecated
 */
export const sendMessage = async (action: string, dataApollo?: any) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })

  const responseFromContent: any = await new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      tabs[0].id || 0,
      {
        action,
        url: tabs[0].url,
        dataApollo,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(response)
        }
      }
    )
  })

  return responseFromContent.parsedInfo
}
