export const metadataDetailCourses = {
  fieldname: 'courses',
  li_selector: ':scope > li',
  section: 'Courses',
  type: 'nested_list',
  xpath: './section/div[2]/div/div[1]/ul',
  path_list: [
    {
      attribute_name: 'name_course',
      path: './div/div/div[2]/div[1]/div[1]/div/div/div/div/span[1]',
    },
    {
      attribute_name: 'associated_with',
      path: './div/div/div[2]/div[2]/ul/li/div/div/div[2]/div/div/span[1]',
    },
  ],
}
