import { parseProfile } from '../parseProfile'
import { metadataExperience } from '../metadataLinkedin/metadataSimple/experience'
import { metadataEducation } from '../metadataLinkedin/metadataSimple/education'
import { metadataCourses } from '../metadataLinkedin/metadataSimple/courses'
import { metadataSkills } from '../metadataLinkedin/metadataSimple/skills'
import { metadataCertifications } from '../metadataLinkedin/metadataSimple/certifications'
import { metadataRecommendations } from '../metadataLinkedin/metadataSimple/recommendations'
import { findHeader } from '../parseLinkedinProfile'
import { parse } from '../parseLinkedinProfile/parse'
import { Field } from '../parsing/models'
import { metadataVolunteering } from '../metadataLinkedin/metadataSimple/volunteering'
import { metadataAbout } from '../metadataLinkedin/metadataSimple/about'
import { metadataProjects } from '../metadataLinkedin/metadataSimple/projects'
import { metadataOrganizations } from '../metadataLinkedin/metadataSimple/organizations'
import { metadataActivity } from '../metadataLinkedin/metadataSimple/acivity'
import { metadataInterests } from '../metadataLinkedin/metadataSimple/interests'
import { metadataCauses } from '../metadataLinkedin/metadataSimple/causes'
import { metadataHonors } from '../metadataLinkedin/metadataSimple/honors'
import { metadataLanguages } from '../metadataLinkedin/metadataSimple/languages'
import { metadataPublications } from '../metadataLinkedin/metadataSimple/publications'

// Here, LinkedIn profile quick-parsing is performed using simple functions to extract information based on specific XPaths stored in metadata or conditions for retrieving data between regular expression patterns.

export const parseSimpleLinkedinProfile = (url: string) => {
  const regex = new RegExp(String.raw`^https:\/\/www\.linkedin\.com\/in\/[^\/]+\/?$`)

  if (!url.match(regex)) {
    return
  }
  const info: any = {
    specific_key: url,
    source: 'linkedin',
    upload_method: 'quick_parse',
    entity: 'profile',
    json_data: {
      linkedin_slug_url: url,
      profile_data: parseProfile(),
    },
  }

  const main = document.querySelector('main') as HTMLElement

  const sections = main.querySelectorAll(':scope > section') as NodeListOf<HTMLElement>

  const metadata: { [k: string]: Field | Field[] } = {
    activity: metadataActivity,
    about: metadataAbout,
    experience: metadataExperience,
    education: metadataEducation,
    courses: metadataCourses,
    skills: metadataSkills,
    certifications: metadataCertifications,
    recommendations: metadataRecommendations,
    volunteering: metadataVolunteering,
    projects: metadataProjects,
    causes: metadataCauses,
    organizations: metadataOrganizations,
    interests: metadataInterests,
    awards: metadataHonors,
    languages: metadataLanguages,
    publications: metadataPublications,
  }

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i]

    const title = findHeader(section)

    if (title && metadata[title]) {
      const currentMetadata = metadata[title]
      info.json_data[title] = Array.isArray(currentMetadata)
        ? currentMetadata.reduce((acc: any, item) => {
            acc[item.fieldname] = parse(section, item)
            return acc
          }, {})
        : parse(section, currentMetadata)
    }
  }

  return info
}
