/* eslint-disable react/no-unescaped-entities */
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom'
import { CommandCard } from '../../../components/CommandCard'
import Coin from '../../../components/Icons/Coin'

export const FindCandidates = () => {
  const navigate = useNavigate()
  return (
      <CommandCard
        title={
          <div style={{ display: 'flex', gap: '4px' }}>
            <EditIcon />
            <div style={{ flexGrow: 1 }}>MatchAI LinkAnalyzer 0.1</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <Coin />
              <span style={{ color: '#4CAF50' }}>1</span>
            </div>
          </div>
        }
        description={
          <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
            Purpose: Enhance your recruitment efficiency with AI-driven candidate matching, tailored
            specifically for LinkedIn and popular job boards.
            <br />
            Input:
            <ol>
              <li>A single job description link.</li>
              <li>Links to 3-6 candidate profiles from LinkedIn.</li>
            </ol>
            Output:
            <ol>
              <li>Optimized job description to attract the right talent.</li>
              <li>Summarized candidate profiles with insightful evaluations.</li>
              <li>Drafted personalized outreach letters to connect with prime candidates.</li>
            </ol>
            Note: Before launching the analysis, open all required links in your browser. Future
            updates will include broader source support.
          </div>
        }
        onClick={() => navigate('/match-ai-link-analyzer-simple')}
      />
  )
}
