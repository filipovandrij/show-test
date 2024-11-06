import DownloadIcon from '@mui/icons-material/Download'
import { useNavigate } from 'react-router-dom'
import { CommandCard } from '../../../components/CommandCard'

export const CsvContacts = () => {
  const navigate = useNavigate()
  return (
    <CommandCard
      title={
        <div style={{ display: 'flex', gap: '4px' }}>
          <DownloadIcon />
          <div style={{ flexGrow: 1 }}>Export data as CSV</div>
        </div>
      }
      description={''}
      onClick={() => navigate('/csv-contacts')}
    />
  )
}
