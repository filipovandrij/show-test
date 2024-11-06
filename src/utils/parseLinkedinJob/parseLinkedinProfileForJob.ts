/* eslint-disable no-await-in-loop */
import { parseProfile } from '../parseProfile'
import { imitationScroll } from '../imitationScroll'
import { timer } from '../timer'
import { getRandomInt } from '../getRandomInt'
import { ConditionalMetadata, findHeader, handleParse } from '../parseLinkedinProfile'
import { metadataAbout } from '../metadataLinkedin/metadataSimple/about'
import { metadataExperience } from '../metadataLinkedin/metadataSimple/experience'
import { metadataDetailExperience } from '../metadataLinkedin/metadataDetail/experience'
import { metadataEducation } from '../metadataLinkedin/metadataSimple/education'
import { metadataSkills } from '../metadataLinkedin/metadataSimple/skills'
import { metadataDetailSkills } from '../metadataLinkedin/metadataDetail/skills'
import { metadataCertifications } from '../metadataLinkedin/metadataSimple/certifications'
import { metadataRecommendations } from '../metadataLinkedin/metadataSimple/recommendations'
import { metadataVolunteering } from '../metadataLinkedin/metadataSimple/volunteering'
import { metadataProjects } from '../metadataLinkedin/metadataSimple/projects'
import { metadataOrganizations } from '../metadataLinkedin/metadataSimple/organizations'
import { metadataInterests } from '../metadataLinkedin/metadataSimple/interests'
import { metadataCauses } from '../metadataLinkedin/metadataSimple/causes'
import { metadataHonors } from '../metadataLinkedin/metadataSimple/honors'
import { metadataLanguages } from '../metadataLinkedin/metadataSimple/languages'
import { metadataPublications } from '../metadataLinkedin/metadataSimple/publications'

const metadata: { [k: string]: ConditionalMetadata } = {
  about: {
    simple: metadataAbout,
  },
  experience: {
    simple: metadataExperience,
    detail: metadataDetailExperience,
  },
  education: {
    simple: metadataEducation,
  },
  skills: {
    simple: metadataSkills,
    detail: metadataDetailSkills,
  },
  certifications: {
    simple: metadataCertifications,
  },
  recommendations: {
    simple: metadataRecommendations,
  },
  volunteering: {
    simple: metadataVolunteering,
  },
  projects: {
    simple: metadataProjects,
  },
  organizations: {
    simple: metadataOrganizations,
  },
  interests: { simple: metadataInterests },
  causes: { simple: metadataCauses },
  awards: {
    simple: metadataHonors,
  },
  languages: {
    simple: metadataLanguages,
  },
  publications: {
    simple: metadataPublications,
  },
}

export const parseLinkedinProfileForJob = async (url: string) => {
  const info: any = {
    id_linkedin: url,
    upload_method: 'full_parse',
  }
  info.profile_data = parseProfile()

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
      info[title] = res.result
    }

    await timer(getRandomInt(1000, 3000))
  }

  return info
}
