import { FC } from 'react'
import { GmailView } from './GmailView'
// import { LinkedinView } from "./LinkedinView";

export type EnhanceUIViews = 'GMAIL' | 'Linkedin'

export const views = {
  GMAIL: GmailView,
  Linkedin: () => null,
} satisfies { [K in EnhanceUIViews]: FC }
