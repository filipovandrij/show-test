import { Host } from '../../../../app/hosts'
import { EnhanceUIViews } from './views'

export const viewByHost: { [k in Host]: EnhanceUIViews } = {
  'mail.google.com': 'GMAIL',
  'www.linkedin.com': 'Linkedin',
} as const

export const isHostAccepted = (host?: string): host is Host => Boolean(host && host in viewByHost)
