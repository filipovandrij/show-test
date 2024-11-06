export type ParserConfig = {
  requestsUrls: string[]
  types: chrome.webRequest.ResourceType[]
  mode: 'auto' | 'manual'
  config: Config[]
}

export type Config = ListConfig | SingleNodeConfig | ConditionalyConfig

export type Operation = 'like' | 'not_like' | 'regexp' | 'not_nil'

export type Condition = {
  xpath: string
  operation: Operation
  value?: string
  containerType?: 'document' | 'parentNode'
  next: Config
}

export type ListConfig = {
  xpath: string
  childNodes?: Config[]
  isList: true
  fieldname: string
  conditions?: never
  iterableCheckConditions?: boolean
}

export type SingleNodeConfig = {
  xpath: string
  childNodes?: Config[]
  isList?: never
  fieldname: string
  conditions?: never
  iterableCheckConditions?: boolean
}

export type ConditionalyConfig = {
  xpath: string
  childNodes?: never
  isList?: never
  fieldname: string
  conditions: Condition[]
  iterableCheckConditions: boolean
}

export const isListConfig = (v: Config): v is ListConfig => !!v.isList

export const isSingleNodeConfig = (v: Config): v is SingleNodeConfig => !v.isList

export const isConditionalyConfig = (v: Config): v is ConditionalyConfig => !!v.conditions
