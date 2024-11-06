export const getNextPath = (xpath: string, i: number) =>
  xpath.replace(new RegExp(String.raw`(.+)\[(\p{N}+)\]$`, 'u'), `$1[${i}]`)
