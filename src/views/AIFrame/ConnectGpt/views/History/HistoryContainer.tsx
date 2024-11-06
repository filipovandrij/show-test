import { memo, useEffect, useState } from 'react'

import { History } from './History'
import { Preloader } from '../../../../../components/Preloader'
import { Conversation } from '../../../../../chrome/gptApi/model'
import { gptApiCall } from '../../../../../utils/gptApiCall'

export const HistoryContainer = memo(() => {
  const [converstionsList, setConverstionsList] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    gptApiCall('getConverSations')({}).then((r) => {
      setConverstionsList(r.items)
      setLoading(false)
    })
  }, [])

  return loading ? <Preloader /> : <History converstionsList={converstionsList} />
})
