import { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { RequestExportBtn } from './components/RequestExportBtn'
import { ExportFile } from './components/ExportFile'
import { fetchFileList } from './Requests/downloadCSV'
import { CsvListItem } from './models/csvList'

const BackBtn = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  background-color: #ebebeb;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    cursor: pointer;
    background-color: #ab47bc;
    color: #fff;

    svg {
      color: #fff;
    }
  }
`

const DialogTitle = styled('div')`
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px ${({ theme: { palette } }) => palette.colorBorder} solid;
  background-color: ${({ theme: { palette } }) => palette.colorBgContainer};
  padding: 10px;
  gap: 12px;
  color: #bdbdbd;
  align-items: center;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`

const Warning = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% - 32px);
  position: fixed;
  bottom: 0;
  background-color: ${({ theme: { palette } }) => palette.colorBgContainer};
  font-family: Axiforma;
  font-size: 16px;
  font-style: bold;
  font-weight: 700;
  color: #bdbdbd;
  margin-left: 16px;
  margin-right: 16px;
  height: 80px;
  border-top: 1px solid #d9d9d9;
`

export const CsvContact = () => {
  const navigate = useNavigate()
  const [csvList, setCsvList] = useState([])

  const fetchData = async () => {
    const list = await fetchFileList()
    setCsvList(list)
  }

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === 'UPDATE_CSV_LIST') {
        fetchData()
      }
    }
    chrome.runtime.onMessage.addListener(handleMessage)
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const intervalId = setInterval(fetchData, 5000)

    return () => clearInterval(intervalId)
  }, [])
  return (
    <>
      <DialogTitle>
        <BackBtn onClick={() => navigate('/main')}>
          <ArrowBackIosIcon style={{ marginLeft: '9px' }} />
        </BackBtn>
        Csv Contacts
      </DialogTitle>
      <div style={{ marginBottom: 80 }}>
        <RequestExportBtn type='contacts' />
        <RequestExportBtn type='organizations' />

        {csvList.map((item: CsvListItem, i) => (
          <ExportFile type={item.content_type} item={item} i={i} />
        ))}
        {/* <ExportFile type='accounts' date={new Date()} /> */}
      </div>
      <Warning>The export will be deleted 60 days after creation!</Warning>
    </>
  )
}
