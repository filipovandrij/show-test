import { GptApi, GptApiKey } from '../chrome/gptApi/model'

export const gptApiCall =
  <T extends GptApiKey>(apiKey: T) =>
  (args: Parameters<GptApi[T]>[0]) =>
    chrome.runtime
      .sendMessage({
        action: 'gpt_api_call',
        apiKey,
        args,
      })
      .then((r) => r as Awaited<ReturnType<GptApi[T]>>)
