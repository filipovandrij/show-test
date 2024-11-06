import { copyText } from './copyText'

export const copyApolloContacts = (contacts: any[]) => {
  let data = ''

  const contactProperties = [
    'Name',
    'linkedin',
    'Title',
    'Company',
    'company_link',
    'company_linkedin',
    'company_facebook',
    'company_twitter',
    'Keywords',
    'Industry',
    'Account Last Activity',
    'Contact Last Activity',
    'Company Country',
    'Contact Location',
    'Email',
    'status_email',
    '# Employees',
    'Phone',
    'Contact Stage',
    'Contact Created',
    'Account Stage',
    'Company State',
    'Company City',
    'Company Location',
    'Account Created',
    'Contact Lists',
    'City',
    'Country',
    'State',
    'date',
    'code',
  ]

  for (let i = 0; i < contacts.length; i++) {
    for (let j = 0; j < contactProperties.length; j++) {
      if (contactProperties[j] === 'Name') {
        const fullname = contacts[i][contactProperties[j]]
        const [firstName, lastName] = fullname.split(' ')

        data += `${fullname}\t`
        data += `${firstName}\t`
        data += `${lastName}\t`
      } else {
        data += `${contacts[i][contactProperties[j]]}\t`
      }
    }

    data += '\n'
  }

  copyText(data)
}
