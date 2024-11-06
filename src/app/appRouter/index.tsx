import { Route, Routes } from 'react-router-dom'
import { AIFrame } from '../../views/AIFrame'
import { Login } from '../../views/Login'
import { Settings } from '../../views/Settings'
import { Frame } from '../../views/Frame'
import { CandidatesForm } from '../../views/AIFrame/FindCandidates/CandidatesForm'
import History from '../../views/AIFrame/NewFindCandidates/History'
import MatchHistory from '../../views/AIFrame/MatchAILinkAnalyzer/History'
import NewCandidatesForm from '../../views/AIFrame/NewFindCandidates/NewCandidatesForm'
import LinkAnalyzerForm from '../../views/AIFrame/MatchAILinkAnalyzer/LinkAnalyzerForm'
import ImportHistory from '../../views/AIFrame/DataImport/ImportHistory'
import TaskPlanner from '../../views/AIFrame/TaskPlanner'
import { CsvContact } from '../../views/AIFrame/CsvContacts/CsvContact'
import { CaseList } from '../../views/AIFrame/Analyzer/pages/CaseList'
import { AnalyzerInnerCase } from '../../views/AIFrame/Analyzer/pages/AnalyzerInnerCase'

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/main' index element={<AIFrame />} />
      <Route path='/login' element={<Login />} />
      <Route path='/tasks' element={<TaskPlanner />} />
      <Route path='/settings' element={<Settings />} />
      <Route path='/frame/:edit' element={<Frame />} />
      <Route path='/match-ai-link-analyzer-simple' element={<CandidatesForm />} />
      <Route path='/recruit-ai-multi-source'>
        <Route path='' element={<History />} />
        <Route path=':id' element={<NewCandidatesForm />} />
      </Route>
      <Route path='/match-ai-link-analyzer'>
        <Route path='' element={<MatchHistory />} />
        <Route path=':id' element={<LinkAnalyzerForm />} />
      </Route>
      <Route path='/analyzer'>
        <Route path='' element={<CaseList />} />
        <Route path=':id' element={<AnalyzerInnerCase />} />
      </Route>
      <Route path='/data-import' element={<ImportHistory />} />
      <Route path='/csv-contacts' element={<CsvContact />} />
    </Routes>
  )
}

export default AppRouter
