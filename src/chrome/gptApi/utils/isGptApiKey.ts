import { GptApiKey } from '../model'
import * as gptApi from '../index'

export const isGptApiKey = (k: any): k is GptApiKey => {
  return typeof k === 'string' && k in gptApi
}
