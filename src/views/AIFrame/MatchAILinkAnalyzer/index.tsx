import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom'
import { CommandCard } from '../../../components/CommandCard'
import Coin from '../../../components/Icons/Coin'

export const MatchAILinkAnalyzer = () => {
  const navigate = useNavigate()

  return (
    <CommandCard
      title={
        <div style={{ display: 'flex', gap: '4px' }}>
          <EditIcon />
          <div style={{ flexGrow: 1 }}>MatchAI LinkAnalyzer 0.5 - Beta</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <Coin />
            <span style={{ color: '#4CAF50' }}>2</span>
          </div>
        </div>
      }
      description={
        <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
          Purpose: Take your recruitment to the next level with comprehensive AI-powered candidate
          profiling.
          <br />
          Input:
          <ol>
            <li>Job descriptions in varied formats including PDFs, links, or text.</li>
            <li>Up to 12 candidate profiles from any recruitment source.</li>
          </ol>
          Output:
          <ol>
            <li>Thorough job description analysis for precise candidate targeting.</li>
            <li>Detailed assessments of candidates with actionable insights.</li>
          </ol>
          Features:
          <ul>
            <li>Versatile job description inputs for greater adaptability.</li>
            <li>
              Expanded candidate sourcing capability, encompassing diverse platforms beyond
              LinkedIn.
            </li>
          </ul>
        </div>
      }
      onClick={() => navigate('/match-ai-link-analyzer')}
    />
  )
}
