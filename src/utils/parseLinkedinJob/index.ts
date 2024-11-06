import { xpath } from '../xpath'
import { getRandomInt } from '../getRandomInt'
import { timer } from '../timer'
// import { enqueueItems } from '../../chrome/queue/QueueManager'

export const parseLinkedinJob = async (url: string) => {
  const info: any = {
    source: 'linkedin',
    entity: 'job_description',
    specific_key: url,
    json_data: {
      specific_key: url,
    },
    upload_method: 'full_parse',
  }

  const main = document.querySelector('main') as HTMLElement

  info.json_data.title = main
    .querySelector('.job-details-jobs-unified-top-card__job-title')
    ?.textContent?.trim()

  const companyLinkContainer = main.querySelector('.app-aware-link[target="_self"]') as HTMLElement
  // const managerLinkContainer = main.querySelector(
  //   'a.app-aware-link[aria-label*="profile"]'
  // ) as HTMLElement

  info.json_data.company_url = companyLinkContainer.getAttribute('href')

  // if (managerLinkContainer) {
  //   const hrefAttribute = companyLinkContainer.getAttribute('href') || ''
  //   const clearManagerUrl = managerLinkContainer.getAttribute('href')
  //   const clearCompanyUrl = hrefAttribute.split('/').slice(0, -1).join('/')

  //   await enqueueItems(
  //     [
  //       {
  //         url: clearCompanyUrl,
  //         entity: 'company',
  //         status: 'added',
  //         source: 'linkedin',
  //         fingerPrint: '123',
  //       },
  //       {
  //         url: clearManagerUrl,
  //         entity: 'profile',
  //         status: 'added',
  //         source: 'linkedin',
  //         fingerPrint: '123',
  //       },
  //     ],
  //     'localStorage'
  //   )
  // } else {
  //   const hrefAttribute = companyLinkContainer.getAttribute('href') || ''
  //   const clearCompanyUrl = hrefAttribute.split('/').slice(0, -1).join('/')

  //   await enqueueItems(
  //     [
  //       {
  //         url: clearCompanyUrl,
  //         entity: 'company',
  //         status: 'added',
  //         source: 'linkedin',
  //         fingerPrint: '123',
  //       },
  //     ],
  //     'localStorage'
  //   )
  // }

  info.json_data.company_name = companyLinkContainer.innerText
  info.json_data.location = xpath('./../text()[2]', companyLinkContainer)?.textContent?.trim()
  info.json_data.description = main.querySelector('#job-details > span')?.textContent?.trim()
  const skillsBtn1 = main.querySelector(
    '#how-you-match-card-container > section:nth-child(2) > div > button'
  ) as HTMLElement

  const skillsBtn2 = main.querySelector(
    '#how-you-match-card-container > section:nth-child(3) > div > button'
  ) as HTMLElement
  if (skillsBtn1) {
    skillsBtn1.click()
    await timer(getRandomInt(500, 800))
  } else if (skillsBtn2) {
    skillsBtn2.click()
    await timer(getRandomInt(500, 800))
  }
  // const skillsBtn = main.querySelector(
  //   '#how-you-match-card-container > section:nth-child(2) > div > button'
  // ) as HTMLElement
  // skillsBtn.click()
  // await timer(getRandomInt(500, 800))

  const skillsList = document.querySelectorAll('.job-details-skill-match-status-list > li')
  info.json_data.skills = []

  for (let i = 0; i < skillsList.length; i++) {
    const skillElement = skillsList[i].querySelector('div > div:nth-child(2)') as HTMLElement
    const skillText = skillElement?.textContent?.trim()

    if (skillText) {
      info.json_data.skills.push({ skill: skillText })
    }
  }
  const skillsDismiss = document.querySelector('.artdeco-modal__dismiss') as HTMLElement
  skillsDismiss.click()

  return info
}
