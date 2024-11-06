import React from 'react'
import CommandApollo from '../componets/CommandApollo'
import { useApolloContacts } from '../hooks/useApolloContacts'
import { withAvailableInUrl } from '../../../utils/withAvailableInUrl'

const ApolloContactComponent = () => {
  const {
    collectContactsApollo,
    stopContactsParse,
    isRunningContactsApollo,
    countContacts,
    copyCurrentContacts,
    resetContacts,
    lastCountContacts,
    copyAllContacts,
    lastUniqueCountContacts,
  } = useApolloContacts()

  return (
    <CommandApollo
      count={countContacts}
      lastCount={lastCountContacts}
      lastUniqueCount={lastUniqueCountContacts}
      entity='contacts'
      collectApollo={collectContactsApollo}
      isRunning={isRunningContactsApollo}
      copyAll={copyAllContacts}
      copyCurrent={copyCurrentContacts}
      reset={resetContacts}
      stopParse={stopContactsParse}
    />
  )
}

export const ApolloContactParse = withAvailableInUrl({
  url: String.raw`^https:\/\/app\.apollo\.io\/#\/people`,
})(ApolloContactComponent)
