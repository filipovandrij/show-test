export const metadataSkills = {
  type: 'nested_list',
  fieldname: 'skills',
  section: 'Skills',
  xpath: './div[3]/ul',
  li_selector: ':scope > li',
  path_list: [
    { attribute_name: 'skill', path: './div/div[2]/div[1]/a/div/div/div/div/span[1]' },
  ],
}
