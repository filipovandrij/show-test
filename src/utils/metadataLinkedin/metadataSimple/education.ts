export const metadataEducation = {
  fieldname: 'education',
  li_selector: ':scope > li',
  section: 'Education',
  type: 'nested_list',
  xpath: './div[3]/ul',
  path_list: [
    { attribute_name: 'school_name', path: './div/div[2]/div[1]/a/div/div/div/div/span[1]' },
    { attribute_name: 'degree_field_study', path: './div/div[2]/div[1]/a/span[1]/span' },
  ],
}
