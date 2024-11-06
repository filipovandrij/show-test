import { Frame } from './models/Frame'

export const createFrame = ({
  id,
  title,
  height = 300,
  left = 0,
  top = 0,
  width = 300,
  frameType = 'field_frame',
}: Frame) => {
  if (document.getElementById(id)) return Promise.resolve(id)
  const iframe = document.createElement('iframe')
  const resolver = {
    res: (_: string) => {},
  }
  const result = new Promise<string>((res) => {
    resolver.res = res
  })
  iframe.setAttribute('id', id)
  iframe.setAttribute('title', title)
  iframe.setAttribute(
    'style',
    `left: ${left}px;width: ${width}px;height: ${height}px;z-index: 2147483650;border: none; position:fixed;top: ${top}px;border-radius: 8px;
    border: 1px solid gray; box-shadow: rgba(34, 60, 80, 0.2) 0px 5px 10px 2px;`
  )

  iframe.setAttribute('allow', '')
  iframe.src = chrome.runtime.getURL('index.html')

  const timeout = setTimeout(() => {
    resolver.res(id)
  }, 1000)

  // eslint-disable-next-line func-names
  iframe.onload = function () {
    setTimeout(() => {
      resolver.res(id)
      clearTimeout(timeout)
      chrome.runtime.sendMessage({
        frameType,
        frameId: id,
      })
    }, 100)
  }
  document.documentElement.appendChild(iframe)

  return result
}
