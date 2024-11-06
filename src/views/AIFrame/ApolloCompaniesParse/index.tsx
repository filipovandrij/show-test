import React from 'react'
import { useApolloCompanies } from '../hooks/useApolloCompanies'
import CommandApollo from '../componets/CommandApollo'
import { withAvailableInUrl } from '../../../utils/withAvailableInUrl'

const ApolloCompaniesComponent = () => {
  const {
    collectCompaniesApollo,
    isRunningCompaniesApollo,
    countCompanies,
    stopCompaniesParse,
    copyCurrentCompanies,
    copyAllCompanies,
    resetCurrentCompanies,
    lastCountCompanies,
    lastUniqueCountCompanies,
  } = useApolloCompanies()

  return (
    <CommandApollo
      count={countCompanies}
      lastCount={lastCountCompanies}
      lastUniqueCount={lastUniqueCountCompanies}
      entity='companies'
      collectApollo={collectCompaniesApollo}
      isRunning={isRunningCompaniesApollo}
      copyAll={copyAllCompanies}
      copyCurrent={copyCurrentCompanies}
      reset={resetCurrentCompanies}
      stopParse={stopCompaniesParse}
    />
  )
}

export const ApolloCompaniesParse = withAvailableInUrl({
  url: String.raw`^https:\/\/app\.apollo\.io\/#\/companies`,
})(ApolloCompaniesComponent)
