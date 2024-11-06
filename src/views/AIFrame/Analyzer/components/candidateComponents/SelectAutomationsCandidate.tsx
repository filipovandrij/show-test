import { FormControl } from '@mui/material'
import { JobSelect, MenuItemJobSelect } from '../../styles/JobDescriptionCard'
import { Bot } from '../../../../../components/Icons/Bot'
import { optionsAutomationsCandidates } from '../../mock/analyzerValues'

const value = () => {
  return (
    <div
      style={{ display: 'flex', gap: 8, color: '#AB47BC', fill: '#AB47BC', alignItems: 'center' }}
    >
      <Bot />
      Automations
    </div>
  )
}
export const SelectAutomationsCandidate = () => {
  return (
    <FormControl fullWidth id={'form-date-Job Board URL'}>
      <JobSelect
        labelId={'select-label-Job Board URL'}
        id={'select-Job Board URL'}
        value={value}
        renderValue={value}
      >
        {optionsAutomationsCandidates.map((item) => (
          <MenuItemJobSelect key={item.id} value='1'>
            {item.content}
          </MenuItemJobSelect>
        ))}
      </JobSelect>
    </FormControl>
  )
}
