import { FormControl, Tooltip } from '@mui/material'
import { Add } from '@mui/icons-material'
import { JobSelect, MenuItemJobSelect } from '../../styles/JobDescriptionCard'
import { optionsCandidates } from '../../mock/analyzerValues'
import { updateCandidate } from '../../Requests/candidates'
type Props = {
  candidate: any
}
const value = () => {
  return (
    <div style={{ display: 'flex', gap: 8, color: '#AB47BC', alignItems: 'center' }}>
      <Add style={{ color: '#AB47BC' }} />
      Add data
    </div>
  )
}
export const SelectDataCandidate = ({ candidate }: Props) => {
  const sendRenderInfo = () => {
    chrome.runtime.sendMessage({ type: 'UPDATE_DATA' })
  }
  const sendRenderAndOpen = async () => {
    chrome.runtime.sendMessage({ type: 'UPDATE_DATA' })
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: 'START_UPLOAD_PDF' })
    }, 1000)
  }
  return (
    <FormControl fullWidth id={'form-date-Job Board URL'}>
      <JobSelect
        labelId={'select-label-Job Board URL'}
        id={'select-Job Board URL'}
        value={value}
        renderValue={value}
      >
        {optionsCandidates.map((item) => (
          <Tooltip key={item.id} followCursor title={item.title}>
            <MenuItemJobSelect
              disabled={
                (candidate.url && item.value === 'candidate_url') ||
                (candidate.instructions.title !== undefined && item.value === 'instructions') ||
                (candidate.custom_data.title !== undefined && item.value === 'customData') ||
                (candidate.extracted_pdf.title !== undefined && item.value === 'extracted_pdf')
              }
              onClick={async () => {
                if (item.value === 'candidate_url') {
                  await updateCandidate(candidate.id, {
                    url: null,
                  })
                  sendRenderInfo()
                }
                if (item.value === 'customData') {
                  await updateCandidate(candidate.id, {
                    custom_data: {
                      title: null,
                      text: null,
                    },
                  })
                  sendRenderInfo()
                }
                if (item.value === 'instructions') {
                  await updateCandidate(candidate.id, {
                    instructions: {
                      title: null,
                      text: null,
                    },
                  })
                  sendRenderInfo()
                }
                if (item.value === 'extracted_pdf') {
                  await updateCandidate(candidate.id, {
                    extracted_pdf: {
                      title: null,
                      text: null,
                    },
                  })
                  sendRenderAndOpen()
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
