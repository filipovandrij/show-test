export const metadataDetailLanguages = {
  type: 'nested_list',
  fieldname: 'languages',
  section: 'languages',
  xpath: './section/div[2]/div/div[1]/ul',
  li_selector: ':scope > li',
  path_list: [
    { attribute_name: 'language', path: './div/div/div[2]/div/div/div/div/div/div/span[1]' },
    { attribute_name: 'proficiency', path: './div/div/div[2]/div/div/span/span[1]' },
  ],
}
