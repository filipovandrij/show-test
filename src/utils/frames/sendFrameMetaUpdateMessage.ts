export const sendFrameMetaUpdateMessage = (frameId: string) => {
  chrome.runtime.sendMessage({
    action: 'frameMetaUpdate',
    frameId,
  })
}
