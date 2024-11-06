import LogoutIcon from '@mui/icons-material/Logout'
import { CommandCard } from '../../../components/CommandCard'
import { StartSelect } from './components/StartSelect'
// import Coin from '../../../components/Icons/Coin'

export const SelectCompanies = () => {

  return (
    <CommandCard
      title={
        <div style={{ display: 'flex', gap: '4px' }}>
          <LogoutIcon />
          <div style={{ flexGrow: 1 }}>Select Companies</div>
          {/* <div style={{ display: 'flex', gap: '4px' }}>
            <Coin />
            <span style={{ color: '#4CAF50' }}>2</span>
          </div> */}
        </div>
      }
      description={
        <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
          Purpose: Take your recruitment to the next level with comprehensive AI-powered candidate
          profiling.
        </div>
      }
      onClick={() => StartSelect()}
    />
  )
}
