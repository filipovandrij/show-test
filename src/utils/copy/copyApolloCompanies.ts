import { copyText } from './copyText'

export const copyApolloCompanies = (companies: any[]) => {
  let data = ''

  const companyProperties = [
    'Company',
    'company_link',
    'company_linkedin',
    'company_facebook',
    'company_twitter',
    '# Employees',
    'Industry',
    'Keywords',
    'Company Location',
    'date',
    'code',
  ]

  for (let i = 0; i < companies.length; i++) {
    for (let j = 0; j < companyProperties.length; j++) {
      data += `${companies[i][companyProperties[j]]}\t`
    }

    data += '\n'
  }

  copyText(data)
}
