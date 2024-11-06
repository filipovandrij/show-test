import { FC } from 'react'
import { View } from '../app/appContext/AppContext'
import { AIFrame } from './AIFrame'
import { Settings } from './Settings'
import { Monitor } from './Monitor'
import { FieldFrame } from './FieldFrame'
import { Login } from './Login'
import { Initial } from './Initial'
import { Frame } from './Frame'

export const views = {
  AIFrame,
  Settings,
  Monitor,
  FieldFrame,
  Login,
  Initial,
  Frame,
} satisfies { [K in View]: FC }
