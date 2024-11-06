import { getToken } from '../../api/getToken'

function base64UrlDecode(input: any) {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  switch (base64.length % 4) {
    case 0:
      break
    case 2:
      base64 += '=='
      break
    case 3:
      base64 += '='
      break
    default:
      throw new Error('Некорректная строка в base64url')
  }
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  )
}

export const checkTestingDev = async () => {
  const token = await getToken()

  if (!token) {
    console.error('Токен не получен.')
    return false
  }
  const parts = token.split('.')

  const decodedPayload = base64UrlDecode(parts[1])
  const payload = JSON.parse(decodedPayload)

  if (payload.is_staff) {
    return true
  }
  return false
}
