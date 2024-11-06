export type Error = { [key: string]: string }
export type StringElement = string | string[] | string[][]

export interface ParsedInfo {
  errors: Error[]
  parse_fields: { [key: string]: StringElement }
  user_url: string
}
