export const metadataDetailEducation = {
  fieldname: 'education',
  li_selector: ':scope > li',
  section: 'Education',
  type: 'nested_list',
  xpath: './section/div[2]/div/div[1]/ul',
  path_list: [
    { attribute_name: 'school_name', path: './div/div/div[2]/div[1]/a/div/div/div/div/span[1]' },
    { attribute_name: 'degree_field_study', path: './div/div/div[2]/div[1]/a/span[1]/span[1]' },
  ],
}
