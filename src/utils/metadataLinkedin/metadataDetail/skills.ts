export const metadataDetailSkills = {
  type: 'nested_list',
  fieldname: 'skills',
  section: 'Skills',
  xpath: './section/div[2]/div[2]/div/div/div[1]/ul',
  li_selector: ':scope > li',
  path_list: [
    { attribute_name: 'skill', path: './div/div/div[2]/div[1]/a/div/div/div/div/span[1]' },
  ],
}
