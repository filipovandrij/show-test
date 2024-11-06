import { getState } from '../state'

export const gptFetcher = async (
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
  auth = true
) => {
  const { gptSession } = await getState()
  return fetch(input, {
    ...init,
    headers: {
      'Accept-Language': 'en-US',
      Referer: 'https://chat.openai.com/',
      'Content-Type': 'application/json',
      'Sec-Fetch-Site': 'same-origin',
      ...(auth && gptSession?.accessToken
        ? { Authorization: `Bearer ${gptSession.accessToken}` }
        : {}),
      ...init?.headers,
    },
  })
}
