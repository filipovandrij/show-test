import { LinkAnalyzer } from '../findCandidatesState'
import { enqueueItem, enqueueItems } from './QueueManager'
import { getState } from '../state'

export const takeToQueue = async () => {
  const currentState = await getState('localStorage')
  const findCandidatesListFromBg = currentState.linkAnalyzer as LinkAnalyzer[]

  if (findCandidatesListFromBg) {
    for (const cases of findCandidatesListFromBg) {
      for (const key of Object.keys(cases.formState || {})) {
        const specificKeyContent = cases.formState[key].specific_key?.content
        const companyLinkedInUrlContent = cases.formState[key].companyLinkedInUrl?.content
        const hiringManagerLinkedInContent = cases.formState[key].hiringManagerLinkedIn?.content

        if (specificKeyContent?.startsWith('https://www.linkedin.com/in')) {
          enqueueItem(
            {
              url: specificKeyContent,
              entity: 'profile',
              status: 'added',
              source: 'linkedin',
              fingerprint: '123',
            },
            'localStorage'
          )
        }

        if (hiringManagerLinkedInContent && companyLinkedInUrlContent) {
          enqueueItems(
            [
              {
                url: companyLinkedInUrlContent,
                entity: 'company',
                status: 'added',
                source: 'linkedin',
                fingerprint: '123',
              },
              {
                url: hiringManagerLinkedInContent,
                entity: 'profile',
                status: 'added',
                source: 'linkedin',
                fingerprint: '123',
              },
            ],
            'localStorage'
          )
        } else if (companyLinkedInUrlContent) {
          enqueueItem(
            {
              url: companyLinkedInUrlContent,
              entity: 'company',
              status: 'added',
              source: 'linkedin',
              fingerprint: '123',
            },
            'localStorage'
          )
        }
      }
    }
  }
}
