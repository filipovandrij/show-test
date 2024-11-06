import * as gptApi from '../index'

export * from '../authSession/model'
export * from '../getConverSations/model'

export type GptApi = typeof gptApi
export type GptApiKey = keyof GptApi
