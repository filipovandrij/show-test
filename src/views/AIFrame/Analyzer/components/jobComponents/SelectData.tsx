import { FormControl, Tooltip } from '@mui/material'
import { Add } from '@mui/icons-material'
import { JobSelect, MenuItemJobSelect } from '../../styles/JobDescriptionCard'
import { optionsJob } from '../../mock/analyzerValues'
import { updateCase } from '../../Requests/requestsCase'
type Props = {
  caseId: number
  checkCase: () => Promise<void>
  jobDescription: any
}
const value = () => {
  return (
    <div style={{ display: 'flex', gap: 8, color: '#AB47BC', alignItems: 'center' }}>
      <Add style={{ color: '#AB47BC' }} />
      Add job data
    </div>
  )
}
export const SelectData = ({ jobDescription, checkCase, caseId }: Props) => {
  return (
    <FormControl fullWidth id={'form-date-Job Board URL'}>
      <JobSelect
        labelId={'select-label-Job Board URL'}
        id={'select-Job Board URL'}
        value={value}
        renderValue={value}
      >
        {optionsJob.map((item) => (
          <Tooltip key={item.id} followCursor title={item.title}>
            <MenuItemJobSelect
              disabled={
                (jobDescription.url !== undefined && item.value === 'job_url') ||
                (jobDescription.hr_url.url !== undefined && item.value === 'hr_url') ||
                (jobDescription.organization_url.url !== undefined &&
                  item.value === 'company_url') ||
                (jobDescription.custom_data.title !== undefined && item.value === 'custom_data') ||
                (jobDescription.instructions.title !== undefined && item.value === 'instructions')
              }
              onClick={async () => {
                if (item.value === 'job_url') {
                  await updateCase(caseId, {
                    job_url: null,
                  })
                  checkCase()
                }
                if (item.value === 'company_url') {
                  await updateCase(caseId, {
                    company_url: null,
                  })
                  checkCase()
                }
                if (item.value === 'hr_url') {
                  await updateCase(caseId, {
                    hr_url: null,
                  })
                  checkCase()
                }
                if (item.value === 'custom_data') {
                  await updateCase(caseId, {
                    custom_data: null,
                  })
                  checkCase()
                }
                if (item.value === 'instructions') {
                  await updateCase(caseId, {
                    instructions: null,
                  })
                  checkCase()
                }
              }}
            >
              {item.content}
            </MenuItemJobSelect>
          </Tooltip>
        ))}
      </JobSelect>
    </FormControl>
  )
}
