export const metadataDetailCertifications = {
  fieldname: 'certifications',
  section: 'Licenses & certifications',
  type: 'nested_list',
  xpath: './section/div[2]/div/div[1]/ul',
  li_selector: ':scope > li',
  path_list: [
    { attribute_name: 'company_link', path: './div/div/div[1]/a' },
    { attribute_name: 'title', path: './div/div/div[2]/div[1]/a/div/div/div/div/span[1]' },
    { attribute_name: 'title', path: './div/div/div[2]/div/div[1]/div/div/div/div/span[1]' },
    { attribute_name: 'company_name', path: './div/div/div[2]/div[1]/a/span[1]/span[1]' },
    { attribute_name: 'company_name', path: './div/div/div[2]/div/div[1]/span[1]/span[1]' },
    { attribute_name: 'issued', path: './div/div/div[2]/div[1]/a/span[2]/span[1]' },
    { attribute_name: 'expires', path: './div/div/div[2]/div/div[1]/span[2]/span[1]' },
    { attribute_name: 'credential_url', path: './div/div/div[2]/div[2]/ul/li[1]/div/div/a' },
  ],
}
