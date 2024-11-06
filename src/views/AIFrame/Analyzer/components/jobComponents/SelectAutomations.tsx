import { FormControl } from '@mui/material'
import { JobSelect, MenuItemJobSelect } from '../../styles/JobDescriptionCard'
import { Bot } from '../../../../../components/Icons/Bot'
import { optionsAutomations } from '../../mock/analyzerValues'
import { updateCase } from '../../Requests/requestsCase'
import { processSalesNavigator, processSearchCandidate } from '../../Requests/openScript'
import { startJobFilter } from '../../Requests/filters'

type Props = {
  caseId: number
  checkCase: () => Promise<void>
  jobDescription: any
}

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
export const SelectAutomations = ({ jobDescription, checkCase, caseId }: Props) => {
  const handleSalesNav = () => {
    processSalesNavigator()
  }
  return (
    <FormControl fullWidth id={'form-date-Job Board URL'}>
      <JobSelect
        labelId={'select-label-Job Board URL'}
        id={'select-Job Board URL'}
        value={value}
        renderValue={value}
      >
        {optionsAutomations.map((item) => (
          <MenuItemJobSelect
            disabled={
              (jobDescription.history_linkedin.date !== undefined &&
                jobDescription.url &&
                // jobDescription.status === 'done' &&
                item.value === 'search_linkedin') ||
              (jobDescription.history_google.date !== undefined &&
                item.value === 'search_linkedin') ||
              item.value === 'offer_letter' ||
              item.value === 'qualification_letter' ||
              item.value === 'interview_letter'
            }
            onClick={async () => {
              if (item.value === 'search_linkedin') {
                await updateCase(caseId, {
                  history_linkedin: {
                    date: String(Date.now()),
                  },
                })
                checkCase()
                startJobFilter(caseId)
                processSearchCandidate()
              }
              if (item.value === 'sales_navigator') {
                handleSalesNav()
              }
            }}
            key={item.id}
            value='1'
          >
            {item.content}
          </MenuItemJobSelect>
        ))}
      </JobSelect>
    </FormControl>
  )
}
