import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { styled } from '@mui/system'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Close, Done, Edit, Fingerprint } from '@mui/icons-material'
import { IconButton, TextField, Tooltip } from '@mui/material'
import { Title } from './style'
import InfoContent from './InfoContent'
import CreateContent from './CreateContent'
import { TImport, TUpdatedImport } from './model'
import Status from './Status'
import { getToken } from '../../../../api/getToken'
import { getBaseUrl } from '../../../../api/baseUrl'
import { icons } from '../index'
import CreateFile from './CreateFile'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  border-radius: 4px;
  background: white;

  font-family: Axiforma;
  font-style: normal;
  line-height: 150%;
`

const Content = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;
  border-radius: 0 0 4px 4px;
`

export const DateImport = styled('span')`
  font-family: Axiforma;
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
`
interface HeaderProps {
  isActive: boolean
}
const Header = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<HeaderProps>(({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: isActive ? '#AB47BC' : 'white',
  '&:hover': {
    backgroundColor: isActive ? '#AB47BC' : '#f3e9f5',
  },
  padding: '8px',
  borderRadius: '4px 4px 0 0',
  cursor: 'pointer',
}))

const ContainerInfo = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`

export const updateImport = async (id: number, obj: Partial<TUpdatedImport>) => {
  const token = await getToken()
  const baseUrl = await getBaseUrl()

  if (token) {
    return fetch(`${baseUrl}/api/import/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    })
  }
}

type Props = TImport & {
  importNavigate: string | undefined
  tags?: string[]
  timeout: MutableRefObject<NodeJS.Timeout | undefined>
  polling: (id: number) => Promise<void>
  devCheck: boolean
}

const Import = ({
  importNavigate,
  tags = [],
  execution_time,
  status,
  source,
  entity,
  total_entities,
  planned_date,
  name,
  polling,
  timeout,
  id,
  guid,
  count_processed,
  created_individuals,
  count_updated_individual,
  count_created_individual,
  count_created_company,
  count_updated_company,
  count_duplicate_individual,
  count_duplicate_company,
  import_number,
  import_type,
  count_errors,
  devCheck,
  validate,
}: Props) => {
  const [isActive, setIsActive] = useState<boolean>(false)
  const [isHover, setIsHover] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [importName, setImportName] = useState(name)
  const isPlanned = !status
  const isFileImport = import_type === 'file'

  const handleSaveEdit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()

      const value = inputRef.current?.value || ''
      await updateImport(id, { name: value })

      setImportName(value)
      setIsEdit(false)
    },
    [inputRef?.current?.value]
  )

  // const handleUpdateTest = async () => {
  //   await updateImport(101, {
  //     count_processed: 0,
  //     current_url:
  //       'https://app.apollo.io/#/people?finderViewId=5b6dfc5a73f47568b2e5f11c&contactLabelIds[]=6643237dc23b6c0001d99c36&prospectedByCurrentTeam[]=yes',
  //     entity: 'profile',
  //     last_timestamp: '1717822957159',
  //     name: 'Import',
  //     planned_date: '2024-05-16T09:17:11.104000Z',
  //     status: 'processing',
  //     total_entities: 800,
  //   })
  // }

  const handleCancelEdit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsEdit(false)
  }, [])

  const handleEdit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsEdit(true)
  }, [])

  const date = new Date(planned_date)

  const options: any = {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }
  const formattedDate = date.toLocaleString('en-GB', options).replace(/ /g, ' ').replace(',', '')

  const deleteImport = async (id: number) => {
    const token = await getToken()
    const baseUrl = await getBaseUrl()

    if (token) {
      return fetch(`${baseUrl}/api/import/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }
    console.log('фффф')
  }

  useEffect(() => {
    if (importNavigate && importNavigate === guid) {
      setIsActive(true)
    }
  }, [])
  const [fingerPrint, setFingerPrint] = useState<boolean>(false)
  const handleFingerPrint = (e: any) => {
    e.stopPropagation()

    fingerPrint ? setFingerPrint(false) : setFingerPrint(true)
  }

  return (
    <Container>
      <Header
        isActive={isActive}
        onClick={() => setIsActive((prev) => !prev)}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {icons[source]}
        {devCheck && <button onClick={() => deleteImport(id)}>Delete</button>}
        {isEdit ? (
          <TextField
            size='small'
            inputRef={inputRef}
            defaultValue={importName}
            onClick={(e) => e.stopPropagation()}
          />
        ) : importName.length > 16 ? (
          <Tooltip title={importName}>
            <Title style={{ color: isActive ? 'white' : 'black' }}>
              {`${importName.slice(0, 15)}…`}
            </Title>
          </Tooltip>
        ) : (
          <Title style={{ color: isActive ? 'white' : 'black' }}>{importName}</Title>
        )}
        {isHover &&
          (isEdit ? (
            <>
              <IconButton size='small' onClick={handleSaveEdit}>
                <Done />
              </IconButton>
              <IconButton size='small' onClick={handleCancelEdit}>
                <Close />
              </IconButton>
            </>
          ) : (
            <IconButton size='small' onClick={handleEdit}>
              <Edit />
            </IconButton>
          ))}
        <ContainerInfo>
          {status === 'done' ? (
            <>
              <DateImport
                style={{
                  color: isActive ? 'white' : 'black',
                }}
              >
                {formattedDate}
              </DateImport>
              <CheckCircleIcon htmlColor='#4CAF50' />
            </>
          ) : (
            <Status status={status} />
          )}

          <IconButton
            onClick={handleFingerPrint}
            sx={{
              color: fingerPrint ? '#AB47BC' : 'rgb(189, 189, 189)',
            }}
          >
            <Fingerprint />
          </IconButton>

          {isActive ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ContainerInfo>
      </Header>
      {isActive && (
        <Content>
          {isPlanned ? (
            isFileImport ? (
              <CreateFile
                tags={tags}
                timeout={timeout}
                polling={polling}
                id={id}
                importNumber={import_number}
                source={source}
                entity={entity}
              />
            ) : (
              <CreateContent
                tags={tags}
                source={source}
                entity={entity}
                polling={polling}
                timeout={timeout}
                id={id}
                guid={guid}
                importNumber={import_number}
              />
            )
          ) : (
            <InfoContent
              total={total_entities}
              execution_time={execution_time}
              status={status}
              conflicts={0}
              count_errors={count_errors}
              count_updated_individual={count_updated_individual}
              newContacts={created_individuals}
              count_processed={count_processed}
              id={id}
              polling={polling}
              timeout={timeout}
              guid={guid}
              importNumber={import_number}
              source={source}
              entity={entity}
              count_duplicate_individual={count_duplicate_individual}
              count_duplicate_company={count_duplicate_company}
              count_created_individual={count_created_individual}
              count_created_company={count_created_company}
              count_updated_company={count_updated_company}
              formattedDate={formattedDate}
              tags={tags}
              validate={validate}
            />
          )}
        </Content>
      )}
    </Container>
  )
}

export default Import
