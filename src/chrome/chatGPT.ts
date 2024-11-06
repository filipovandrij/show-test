export {}

chrome.runtime.sendMessage({
  action: 'update_gpt_session',
})
