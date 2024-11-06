import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import { useNavigate } from 'react-router-dom'
import { CommandCard } from '../../../components/CommandCard'

export const Analyzer = () => {
  const navigate = useNavigate()

  // The analyzer is convenient for use by developers because it employs the simplest architecture. In the main folder, there is the Analyzer component, which serves merely as a command to navigate to the CaseList, where all existing cases, their search, and the ability to add new cases are located. Additionally, a case can be created automatically when we are on a job vacancy page. After parsing the vacancy, a button is rendered that creates a case with the already prepared vacancy. There should only be one vacancy in the case, which can be found in JobForm. There is also a component for candidates (Candidates), where all functionalities related to candidates and their internal interactions are described. Additionally, filters are generated using AI based on the vacancy analysis (Filters). The folder with requests to endpoints is separated and called Requests, containing all the requests used by the Analyzer, as well as redirects to LinkedIn pages for search. There is an option to redirect to LinkedIn candidate searches and add them directly to the case. The plugin remembers the last case you worked on, automatically overwriting its ID in local storage, and adds candidates based on this ID, but this can also be done manually through the candidate addition form within the case. Once the vacancy and all candidates have been collected and parsed with a positive status, an analysis of candidates for the vacancy can be conducted. After that, we receive the result in Feedback, where we also have the logic for evaluating the completed analysis.

  return (
    <CommandCard
      title={
        <div style={{ display: 'flex', gap: '4px' }}>
          <AssignmentIndIcon />
          <div style={{ flexGrow: 1 }}>AI Headhunter 0.3</div>
        </div>
      }
      description={
        <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
          Purpose: Take your recruitment to the next level with comprehensive AI-powered candidate
          profiling.
        </div>
      }
      onClick={() => navigate('/analyzer')}
    />
  )
}
