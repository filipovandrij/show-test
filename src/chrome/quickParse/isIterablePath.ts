export const isIterablePath = (xpath: string) =>
  new RegExp(String.raw`.+\[\p{N}+\]$`, 'u').test(xpath)
