import { FC } from 'react'
import { GmailView } from './GmailView'
import { LinkedinView } from './LinkedinView'

export type Views = 'GMAIL' | 'Linkedin'

export const views = {
  GMAIL: GmailView,
  Linkedin: LinkedinView,
} satisfies { [K in Views]: FC }
