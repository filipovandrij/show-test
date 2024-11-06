/* eslint-disable no-await-in-loop */
import { parseProfile } from '../parseProfile'
import { metadataExperience } from '../metadataLinkedin/metadataSimple/experience'
import { metadataEducation } from '../metadataLinkedin/metadataSimple/education'
import { metadataCourses } from '../metadataLinkedin/metadataSimple/courses'
import { metadataSkills } from '../metadataLinkedin/metadataSimple/skills'
import { metadataCertifications } from '../metadataLinkedin/metadataSimple/certifications'
import { metadataRecommendations } from '../metadataLinkedin/metadataSimple/recommendations'
// import { timer } from '../timer'
import { parseContactInfo } from '../parseContactInfo'
// import { getRandomInt } from '../getRandomInt'
import { xpath } from '../xpath'
import { imitationMoveClick } from '../imitationMoveClick'
import { metadataDetailExperience } from '../metadataLinkedin/metadataDetail/experience'
import { metadataDetailEducation } from '../metadataLinkedin/metadataDetail/education'
import { metadataDetailSkills } from '../metadataLinkedin/metadataDetail/skills'
import { parseDetail } from './parseDetail'
import { parse } from './parse'
import { metadataDetailCourses } from '../metadataLinkedin/metadataDetail/courses'
import { metadataDetailRecommendations } from '../metadataLinkedin/metadataDetail/recommendations'
import { metadataDetailCertifications } from '../metadataLinkedin/metadataDetail/certifications'
import { Field } from '../parsing/models'
import { metadataAbout } from '../metadataLinkedin/metadataSimple/about'
import { metadataVolunteering } from '../metadataLinkedin/metadataSimple/volunteering'
import { metadataProjects } from '../metadataLinkedin/metadataSimple/projects'
import { metadataDetailProjects } from '../metadataLinkedin/metadataDetail/projects'
import { metadataOrganizations } from '../metadataLinkedin/metadataSimple/organizations'
import { metadataInterests } from '../metadataLinkedin/metadataSimple/interests'
import { metadataCauses } from '../metadataLinkedin/metadataSimple/causes'
import { metadataHonors } from '../metadataLinkedin/metadataSimple/honors'
import { metadataLanguages } from '../metadataLinkedin/metadataSimple/languages'
import { metadataActivity } from '../metadataLinkedin/metadataSimple/acivity'
import { metadataDetailLanguages } from '../metadataLinkedin/metadataDetail/languages'
import { metadataDetailHonors } from '../metadataLinkedin/metadataDetail/honors'
import { metadataPublications } from '../metadataLinkedin/metadataSimple/publications'
import { imitationScroll } from '../imitationScroll'
import { timer } from '../timer'
import { getRandomInt } from '../getRandomInt'

const metadata: { [k: string]: ConditionalMetadata } = {
  activity: { simple: metadataActivity },
  about: {
    simple: metadataAbout,
  },
  experience: {
    simple: metadataExperience,
    detail: metadataDetailExperience,
  },
  education: {
    simple: metadataEducation,
    detail: metadataDetailEducation,
  },
  courses: {
    simple: metadataCourses,
    detail: metadataDetailCourses,
  },
  skills: {
    simple: metadataSkills,
    detail: metadataDetailSkills,
  },
  certifications: {
    simple: metadataCertifications,
    detail: metadataDetailCertifications,
  },
  recommendations: {
    simple: metadataRecommendations,
    detail: metadataDetailRecommendations,
  },
  volunteering: {
    simple: metadataVolunteering,
  },
  projects: {
    simple: metadataProjects,
    detail: metadataDetailProjects,
  },
  organizations: {
    simple: metadataOrganizations,
  },
  interests: { simple: metadataInterests },
  causes: { simple: metadataCauses },
  awards: {
    simple: metadataHonors,
    detail: metadataDetailHonors,
  },
  languages: {
    simple: metadataLanguages,
    detail: metadataDetailLanguages,
  },
  publications: {
    simple: metadataPublications,
  },
}

export const findHeader = (section: HTMLElement) => {
  const header = xpath('./div[2]/div/div/div/h2/span[1]', section)

  const word = header && header.textContent?.trim().split(' ')

  return word && word[word.length - 1].toLowerCase()
}

export const handleParse = async (
  section: HTMLElement,
  main: HTMLElement,
  sections: NodeListOf<HTMLElement>,
  metadata: any,
  metadataDetail?: any
) => {
  const detailAnchor = xpath('.//a[contains(@id, "navigation-index")]', section)
  let result: any = {}

  if (detailAnchor instanceof HTMLElement && metadataDetail) {
    const scrollPositionBeforeClick = window.scrollY
    await imitationMoveClick(detailAnchor)
    result = await parseDetail(metadataDetail)

    main = document.querySelector('main') as HTMLElement
    sections = main.querySelectorAll(':scope > section')

    window.scrollTo(0, scrollPositionBeforeClick)
  } else {
    result = Array.isArray(metadata)
      ? metadata.reduce((acc, item) => {
          acc[item.fieldname] = parse(section, item)
          return acc
        }, {})
      : parse(section, metadata)
  }

  return { result, main, sections }
}

export type ConditionalMetadata = {
  detail?: Field
  simple: Field | Field[]
}

export const parseLinkedinProfile = async (url: string) => {
  const info: any = {
    specific_key: url,
    source: 'linkedin',
    entity: 'profile',
    upload_method: 'full_parse',
    json_data: {
      linkedin_slug_url: url,
      profile_data: parseProfile(),
      contact_info: await parseContactInfo(),
    },
  }
  await timer(getRandomInt(500, 1000))

  let main = document.querySelector('main') as HTMLElement

  let sections = main.querySelectorAll(':scope > section') as NodeListOf<HTMLElement>

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i]

    await imitationScroll(section)

    const title = findHeader(section)

    if (title && metadata[title]) {
      const currentMetadata = metadata[title]
      const res = await handleParse(
        section,
        main,
        sections,
        currentMetadata.simple,
        currentMetadata?.detail
      )
      main = res.main
      sections = res.sections
      info.json_data[title] = res.result
    }

    // await timer(getRandomInt(1000, 1500))
  }

  return info
}
