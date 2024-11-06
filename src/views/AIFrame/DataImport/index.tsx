import { useNavigate } from 'react-router-dom'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Button as MuiButton } from '@mui/material'
import React, { useCallback } from 'react'
import { styled } from '@mui/system'
import { CommandCard } from '../../../components/CommandCard'
import { getToken } from '../../../api/getToken'
import { getBaseUrl } from '../../../api/baseUrl'
import { Apollo } from '../../../components/Icons/apollo'
import { TEntity, TSource } from './Import/model'
import { Linkedin } from '../../../components/Icons/Linkedin'

const createImport = async (source: string, entity: string, import_type: string) => {
  const token = await getToken()
  const baseUrl = await getBaseUrl()

  if (token) {
    return fetch(`${baseUrl}/api/import/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        source,
        entity,
        import_type,
      }),
    })
  }
}

type ImportButton = {
  source: TSource
  entity: TEntity
  content: string
  import_type: string
}

const buttons: ImportButton[] = [
  { source: 'zoominfo', entity: 'profile', content: 'ZoomInfo', import_type: 'parse' },
  { source: 'apollo', entity: 'profile', content: 'Profile', import_type: 'parse' },
  { source: 'apollo', entity: 'company', content: 'Company', import_type: 'parse' },
  { source: 'sales_navigator', entity: 'profile', content: 'Add csv', import_type: 'file' },
]

export const icons: Partial<Record<TSource, JSX.Element>> = {
  apollo: <Apollo />,
  sales_navigator: <Linkedin />,
  linkedin: <Linkedin />,
}

const Button = styled(MuiButton)`
  background-color: #fff;
  text-transform: none;
  gap: 8px;
  color: #212121;

  &:hover {
    background-color: #fff;
  }
`

// The import works in such a way that you need to go to the Apollo page with a ready list for parsing. If it’s people, select contacts; if it’s companies, select companies. After that, an import is created, which already captures the URL to be parsed. Then, we specify how many contacts or companies we need to parse. Once we choose the number to parse, we click 'Create,' and the import processing queue starts. If there are imports already in progress, the newly created one will wait until the previous ones are completed. It opens a tab in the background, checks certain data for sorting the list, and if any are missing, it corrects them. Then, it starts parsing contact lists in batches of 25, making a request to the endpoint with this information each time, and continues until the specified number is reached. After that, it closes the tab and marks the import as completed.

export const DataImport = () => {
  const navigate = useNavigate()

  const handleClick = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement>,
      source: string,
      entity: string,
      import_type: string
    ) => {
      e.stopPropagation()
      await createImport(source, entity, import_type)
      navigate('/data-import')
    },
    []
  )

  return (
    <CommandCard
      title={
        <div style={{ display: 'flex', gap: '4px' }}>
          <CloudUploadIcon />
          <div style={{ flexGrow: 1 }}>Data Import</div>
        </div>
      }
      description={
        <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
          The import command is designed to automatically retrieve a list of contacts from LinkedIn,
          Apollo, and other sources. Using the Aide plugin, the team performs scraping from sources
          in automatic mode. The resulting contact list can be processed and used according to your
          goals.
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {buttons.map(({ source, content, entity, import_type }) => (
              <Button
                sx={{
                  fontFamily: 'Axiforma',
                }}
                onClick={(e) => handleClick(e, source, entity, import_type)}
              >
                {icons[source]}
                {content}
              </Button>
            ))}
          </div>
        </div>
      }
      onClick={() => navigate('/data-import')}
    />
  )
}
