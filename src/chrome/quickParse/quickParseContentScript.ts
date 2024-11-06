import hash_sum from 'hash-sum'
import api from '../../api'
import { getToken } from '../../api/getToken'
import { ParserConfig } from './model/ParserConfig'
import { parse } from './parse'
;(async () => {
  const parser: { parser: ParserConfig; url: string } | undefined =
    await chrome.runtime.sendMessage({
      action: 'get_parser',
    })

  if (!parser || !parser.url || !parser.parser || !parser.parser.config?.length) {
    chrome.runtime.sendMessage({
      action: 'update_quick_parse_state',
      processing: false,
    })
    return
  }

  const url = decodeURIComponent(parser.url)
  const info = parse(parser.parser.config)
  const infoStr = JSON.stringify(info, null, 2)

  chrome.runtime.sendMessage({
    action: 'update_quick_parse_state',
    processing: false,
    data: infoStr,
  })

  const storage = await chrome.storage.sync.get()
  const token = await getToken()

  if (!token) return
  const { user_id } = JSON.parse(atob(token.split('.')[1]))
  if (typeof user_id !== 'number') return
  const hash = hash_sum(infoStr)
  const prev_hash = storage[user_id]?.[url]

  if (!prev_hash || prev_hash !== hash) {
    chrome.storage.local.set({
      [user_id]: { ...storage[user_id], [url]: hash },
    })
    const r = await api.savingData(info)

    if (!r.ok) throw Error()
  }
})()
