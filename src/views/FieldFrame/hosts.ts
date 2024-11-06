import { Host } from '../../app/hosts'
import { Views } from './views'

export const viewByHost: { [k in Host]: Views } = {
  'mail.google.com': 'GMAIL',
  'www.linkedin.com': 'Linkedin',
} as const

export const isHostAccepted = (host?: string): host is Host => Boolean(host && host in viewByHost)
