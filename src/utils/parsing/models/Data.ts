export interface Data {
  fieldname: string
  error: {}
}

export interface DataSingle extends Data {
  content: string
}

export interface DataList<T> extends Data {
  content: T[]
}

export type DataParse = DataList<string[]> | DataList<string> | DataSingle
