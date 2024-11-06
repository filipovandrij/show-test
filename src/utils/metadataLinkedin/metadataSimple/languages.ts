export const metadataLanguages = {
  type: 'nested_list',
  fieldname: 'languages',
  section: 'languages',
  xpath: './div[3]/ul',
  li_selector: ':scope > li',
  path_list: [
    { attribute_name: 'language', path: './div/div[2]/div/div/div/div/div/div/span[1]/text()' },
    { attribute_name: 'proficiency', path: './div/div[2]/div/div/span/span[1]' },
  ],
}
