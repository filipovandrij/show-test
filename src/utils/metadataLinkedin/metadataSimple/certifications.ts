export const metadataCertifications = {
  fieldname: 'certifications',
  li_selector: ':scope > li',
  section: 'Licenses & certifications',
  type: 'nested_list',
  xpath: './div[3]/ul',
  path_list: [
    { attribute_name: 'company_link', path: './div/div[1]/a' },
    { attribute_name: 'title', path: './div/div[2]/div[1]/a/div/div/div/div/span' },
    { attribute_name: 'company_name', path: './div/div[2]/div[1]/a/span[1]' },
    { attribute_name: 'issued', path: './div/div[2]/div[1]/a/span[2]/span[1]' },
    { attribute_name: 'title', path: './div/div[2]/div[1]/div[1]/div/div/div/div/span' },
    { attribute_name: 'company_name', path: './div/div[2]/div[1]/div[1]/span[1]/span' },
    { attribute_name: 'expires', path: './div/div[2]/div[1]/div[1]/span[2]/span' },
    { attribute_name: 'credential_url', path: './div/div[2]/div[2]/ul/li[1]/div/div/a' },
  ],
}