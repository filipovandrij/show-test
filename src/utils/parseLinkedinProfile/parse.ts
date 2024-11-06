import { parseField } from '../parsing'

export const parse = (section: HTMLElement, metadata: any) => {
  return parseField(metadata, section).content || '-'
}
