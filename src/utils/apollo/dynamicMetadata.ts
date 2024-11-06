import { Single } from '../parsing/models'

type createdXpath = { [key: string]: (i: number) => string }

export const newXpathContact: createdXpath = {
  full_name: (i: number) => `./td[${i}]/div[1]/div[2]/div/div/div[1]/div/div[1]/div/a`,
  id: (i: number) => `./td[${i}]/div[1]/div[2]/div/div/div[1]/div/div[1]/div/a`,
  linkedin: (i: number) => `./td[${i}]/div[1]/div[2]/div/div/div[1]/div/div[2]/span/a`,
  title: (i: number) => `./td[${i}]/div[1]/div/div/div[1]/span`,
  company_name: (i: number) => `./td[${i}]/div[1]/div/div/div[1]/span/div/div[1]/a`,
  company_link: (i: number) => `./td[${i}]/div[1]/div/div/div[1]/span/div/div[2]/span[1]/a`,
  company_linkedin: (i: number) =>
    `./td[${i}]/div[1]/div/div/div[1]/span/div/div[2]/span/a[contains(@href, 'www.linkedin.com')]`,
  company_facebook: (i: number) =>
    `./td[${i}]/div[1]/div/div/div[1]/span/div/div[2]/span/a[contains(@href, 'https://www.facebook.com/')]`,
  company_twitter: (i: number) =>
    `./td[${i}]/div[1]/div/div/div[1]/span/div/div[2]/span/a[contains(@href, 'https://twitter.com/')]`,
  account_last_activity: (i: number) => `./td[${i}]/span`,
  contact_last_activity: (i: number) => `./td[${i}]/span`,
  contact_location: (i: number) => `./td[${i}]/div[1]/div/div/div[1]/span`,
  employees: (i: number) => `./td[${i}]/span`,
  keywords: (i: number) => `./td[${i}]/span/div`,
  email: (i: number) => `./td[${i}]/div[1]/div/div/div[1]/div/div/div/div/div/a`,
  status_email: (i: number) => `./td[${i}]/div[1]/div/div/div[1]/div/div/i`,
  industry: (i: number) => `./td[${i}]/span`,
  phone: (i: number) => `./td[${i}]/div[1]/div/div/div[1]/span/div/a`,
  zb_provider: (i: number) => `./td[${i}]/div[1]/div/div/div[1]/span`,
  crm_id: (i: number) => `./td[${i}]/span/span/div/div/div[1]`,
  zb_status: (i: number) => `./td[${i}]/span/span/div/div/div[1]`,
  contact_stage: (i: number) => `./td[${i}]/div[1]/div/div`,
  contact_created: (i: number) => `./td[${i}]/span`,
  account_stage: (i: number) => `./td[${i}]/div[1]/div/div/div[1]/div/div/div/span`,
  company_country: (i: number) => `./td[${i}]/span`,
  company_state: (i: number) => `./td[${i}]/span`,
  company_city: (i: number) => `./td[${i}]/span`,
  company_location: (i: number) => `./td[${i}]/span`,
  account_created: (i: number) => `./td[${i}]/span`,
  contact_lists: (i: number) => `./td[${i}]/span`,
  city: (i: number) => `./td[${i}]/span`,
  country: (i: number) => `./td[${i}]/span`,
  state: (i: number) => `./td[${i}]/span`,
}

export const newXpathContactForNet: createdXpath = {
  full_name: (i: number) => `./td[${i}]/div[1]/div[2]/div[1]/div/a`,
  id: (i: number) => `./td[${i}]/div[1]/div[2]/div[1]/div/a`,
  linkedin: (i: number) => `./td[${i}]/div[1]/div[2]/div[2]/span/a`,
  title: (i: number) => `./td[${i}]/span`,
  company_name: (i: number) => `./td[${i}]/span/div/div[1]/a`,
  company_link: (i: number) => `./td[${i}]/span/div/div[2]/span[1]/a`,
  company_linkedin: (i: number) => `./td[${i}]/span/div/div[2]/span[2]/a`,
  company_facebook: (i: number) => `./td[${i}]/span/div/div[2]/span[3]/a`,
  company_twitter: (i: number) => `./td[${i}]/span/div/div[2]/span[4]/a`,
  account_last_activity: (i: number) => `./td[${i}]/span`,
  contact_last_activity: (i: number) => `./td[${i}]/span`,
  contact_location: (i: number) => `./td[${i}]/span`,
  employees: (i: number) => `./td[${i}]/span`,
  keywords: (i: number) => `./td[${i}]/span/div`,
  email: (i: number) => `./td[${i}]/div[1]/div/div/div[1]/div/div/div/div/div/a`,
  status_email: (i: number) => `./td[${i}]/div[1]/div/div/div[1]/div/div/i`,
  industry: (i: number) => `./td[${i}]/span/div/span`,
  phone: (i: number) => `./td[${i}]/div[1]/div/div/div[1]/span/div/a`,
  zb_provider: (i: number) => `./td[${i}]/div[1]/div/div/div[1]/span`,
  crm_id: (i: number) => `./td[${i}]/span/span/div/div/div[1]`,
  zb_status: (i: number) => `./td[${i}]/span/span/div/div/div[1]`,
  contact_stage: (i: number) => `./td[${i}]/div[1]/div/div`,
  contact_Created: (i: number) => `./td[${i}]/span`,
  account_stage: (i: number) => `./td[${i}]//span`,
  company_country: (i: number) => `./td[${i}]/span`,
  company_state: (i: number) => `./td[${i}]/span`,
  company_city: (i: number) => `./td[${i}]/span`,
  company_cocation: (i: number) => `./td[${i}]/span`,
  account_created: (i: number) => `./td[${i}]/span`,
  contact_lists: (i: number) => `./td[${i}]/span`,
  city: (i: number) => `./td[${i}]/span`,
  country: (i: number) => `./td[${i}]/span`,
  state: (i: number) => `./td[${i}]/span`,
}

export const createMetadataContact = (newXpathContact: createdXpath) => {
  const headItems = document.querySelectorAll('th')

  const formattedHeadings = Array.from(headItems).map((item) => {
    let text = item.innerText.replace(/^#/, '').trim().toLowerCase()
    text = text.replace(/ /g, '_')
    if (text === 'name') {
      text = 'full_name'
      return text
    }
    if (text === 'company') {
      text = 'company_name'
    }
    if (text === 'zb_smtp_provider') {
      text = 'zb_provider'
    }
    return text
  })
  console.log(formattedHeadings)

  const dynamicMetadata: Single[] = []

  for (let i = 1, j = 0; j < formattedHeadings.length; j++, i++) {
    const fieldname = formattedHeadings[j]
    switch (fieldname) {
      case 'full_name': {
        dynamicMetadata.push({
          type: 'single',
          fieldname,
          section: 'contact',
          xpath: newXpathContact[fieldname](i),
        })
        dynamicMetadata.push({
          type: 'single',
          fieldname: 'id',
          section: 'contact',
          xpath: newXpathContact.id(i),
        })
        dynamicMetadata.push({
          type: 'single',
          fieldname: 'linkedin',
          section: 'contact',
          xpath: newXpathContact.linkedin(i),
        })
        break
      }
      case 'zb_provider': {
        dynamicMetadata.push({
          type: 'single',
          fieldname,
          section: 'contact',
          xpath: newXpathContact[fieldname](i),
        })
        break
      }
      case 'crm_id': {
        dynamicMetadata.push({
          type: 'single',
          fieldname,
          section: 'contact',
          xpath: newXpathContact[fieldname](i),
        })
        break
      }
      case 'zb_status': {
        dynamicMetadata.push({
          type: 'single',
          fieldname,
          section: 'contact',
          xpath: newXpathContact[fieldname](i),
        })
        break
      }
      case 'company_name': {
        dynamicMetadata.push({
          type: 'single',
          fieldname,
          section: 'contact',
          xpath: newXpathContact[fieldname](i),
        })
        dynamicMetadata.push({
          type: 'single',
          fieldname: 'company_link',
          section: 'contact',
          xpath: newXpathContact.company_link(i),
        })
        dynamicMetadata.push({
          type: 'single',
          fieldname: 'company_linkedin',
          section: 'contact',
          xpath: newXpathContact.company_linkedin(i),
        })
        dynamicMetadata.push({
          type: 'single',
          fieldname: 'company_facebook',
          section: 'contact',
          xpath: newXpathContact.company_facebook(i),
        })
        dynamicMetadata.push({
          type: 'single',
          fieldname: 'company_twitter',
          section: 'contact',
          xpath: newXpathContact.company_twitter(i),
        })
        break
      }

      case 'email': {
        dynamicMetadata.push({
          type: 'single',
          fieldname,
          section: 'contact',
          xpath: newXpathContact[fieldname](i),
        })
        dynamicMetadata.push({
          type: 'single',
          fieldname: 'status_email',
          section: 'contact',
          xpath: newXpathContact.status_email(i),
        })
        break
      }
      default: {
        if (!newXpathContact[fieldname]) break
        dynamicMetadata.push({
          type: 'single',
          fieldname,
          section: 'contact',
          xpath: newXpathContact[fieldname](i),
        })
      }
    }
  }

  return dynamicMetadata
}
export const newXpathCompany: createdXpath = {
  company_name: (i: number) =>
    `./td[${i}]/div[1]/div[2]/div/div/div[1]/span/div/div[1] | ./td[${i}]/div[1]/span/div[1]/div[1]`,
  id: (i: number) =>
    `./td[${i}]/div[1]/div[2]/div/div/div[1]/span/div/div[1]/a | ./td[${i}]/div[1]/span/div[1]/div[1]/a`,
  company_link: (i: number) =>
    `./td[${i}]/div[1]/div[2]/div/div/div[1]/span/div/div[2]/span[1]/a | ./td[${i}]/div[1]/span/div/div[2]/span[1]/a[not(contains(@href, 'https://www.facebook.com/')) and not(contains(@href, 'www.linkedin.com')) and not(contains(@href, 'https://twitter.com/'))]`,
  company_linkedin: (i: number) =>
    `./td[${i}]/div[1]/div[2]/div/div/div[1]/span/div/div[2]/span/a[contains(@href, 'www.linkedin.com')] | ./td[${i}]//a[contains(@href, 'www.linkedin.com')]`,
  company_facebook: (i: number) =>
    `./td[${i}]/div[1]/div[2]/div/div/div[1]/span/div/div[2]/span/a[contains(@href, 'https://www.facebook.com/')] | ./td[${i}]//a[contains(@href, 'https://www.facebook.com/')]`,
  company_twitter: (i: number) =>
    `./td[${i}]/div[1]/div[2]/div/div/div[1]/span/div/div[2]/span/a[contains(@href, 'https://twitter.com/')] | /td[${i}]//a[contains(@href, 'https://twitter.com/')]`,
  employees: (i: number) => `./td[${i}]/span`,
  keywords: (i: number) => `./td[${i}]/span/div`,
  industry: (i: number) => `./td[${i}]/span/div/span`,
  company_location: (i: number) => `./td[${i}]/span`,
}

export const createMetadataCompany = () => {
  const headItems = document.querySelectorAll('th')

  const formattedHeadings = Array.from(headItems).map((item) => {
    let text = item.innerText.replace(/^#/, '').trim().toLowerCase()
    text = text.replace(/ /g, '_')
    if (text === 'company') {
      text = 'company_name'
      return text
    }
    return text
  })
  const dynamicMetadata: Single[] = []

  for (let i = 1, j = 0; j < formattedHeadings.length; j++, i++) {
    const fieldname = formattedHeadings[j]
    switch (fieldname) {
      case 'company_name': {
        dynamicMetadata.push({
          type: 'single',
          fieldname,
          section: 'contact',
          xpath: newXpathCompany[fieldname](i),
        })
        dynamicMetadata.push({
          type: 'single',
          fieldname: 'id',
          section: 'contact',
          xpath: newXpathCompany.id(i),
        })
        dynamicMetadata.push({
          type: 'single',
          fieldname: 'company_link',
          section: 'contact',
          xpath: newXpathCompany.company_link(i),
        })
        dynamicMetadata.push({
          type: 'single',
          fieldname: 'company_linkedin',
          section: 'contact',
          xpath: newXpathCompany.company_linkedin(i),
        })
        dynamicMetadata.push({
          type: 'single',
          fieldname: 'company_facebook',
          section: 'contact',
          xpath: newXpathCompany.company_facebook(i),
        })
        dynamicMetadata.push({
          type: 'single',
          fieldname: 'company_twitter',
          section: 'contact',
          xpath: newXpathCompany.company_twitter(i),
        })
        break
      }
      default: {
        if (!newXpathCompany[fieldname]) break
        dynamicMetadata.push({
          type: 'single',
          fieldname,
          section: 'contact',
          xpath: newXpathCompany[fieldname](i),
        })
      }
    }
  }

  return dynamicMetadata
}
