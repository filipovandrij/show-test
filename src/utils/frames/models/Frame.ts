export type Frame<T extends object = any> = {
  id: string
  title: string
  width?: number
  height?: number
  left?: number
  top?: number
  meta?: T
  frameType?: string
}
