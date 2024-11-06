import { FC } from 'react'
import EditView from './EditView'
import MonitoringView from './MonitoringView'
import GptSettings from './GptSettings'

export type Views = 'edit' | 'monitoring' | 'gptSettings'

type Props = {
  close: () => void
}
export const views = {
  edit: EditView,
  monitoring: MonitoringView,
  gptSettings: GptSettings,
} satisfies { [K in Views]: FC<Props> }
