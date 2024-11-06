import React, { MutableRefObject, useCallback, useState } from 'react'
import { Button, MenuItem, Select } from '@mui/material'
import { Add } from '@mui/icons-material'
import { Title } from './style'
import { updateImport } from './index'
import UploadCSVFile from './UploadCSVFile'
import api from '../../../../api'

type Props = {
  tags: string[]
  timeout: MutableRefObject<NodeJS.Timeout | undefined>
  polling: (id: number) => Promise<void>
  id: number
  importNumber: number
  source: string
  entity: string
}

const CreateFile = ({ source, entity, tags, timeout, polling, id, importNumber }: Props) => {
  const [tag, setTag] = useState('')
  const [file, setFile] = useState<string | Blob>('')

  const handleClick = useCallback(async () => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('import_number', `${importNumber}`)
      formData.append('source', `${source}`)
      formData.append('entity', `${entity}`)

      await api.uploadCSV(formData)
      await updateImport(id, {
        status: 'done',
        planned_date: new Date().toISOString(),
      })
      timeout.current = setTimeout(() => polling(id), 5000)
    }
  }, [file])

  return (
    <>
      <Title>Select a list</Title>
      <div style={{ display: 'flex', gap: 16 }}>
        <Select size='small' fullWidth value={tag} onChange={(e) => setTag(e.target.value)}>
          {tags.map((tag) => (
            <MenuItem value={tag}>{tag}</MenuItem>
          ))}
        </Select>
        <Button size='small' variant='outlined' fullWidth>
          <Add />
          Create
        </Button>
      </div>
      <UploadCSVFile setFile={setFile} />
      <Button variant='contained' onClick={handleClick}>
        Import
      </Button>
    </>
  )
}

export default CreateFile
