export const metadataSimpleAboutCompany = {
  type: 'nested_list',
  fieldname: 'about',
  section: 'about',
  xpath: './div/div',
  li_selector: ':scope > div',
  path_list: [
    { attribute_name: 'overview', path: './div/span[1]' },
    { attribute_name: 'website', path: './div[1]/div/a' },
  ],
}
