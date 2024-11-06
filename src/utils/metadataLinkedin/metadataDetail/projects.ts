export const metadataDetailProjects = {
  type: 'nested_list',
  fieldname: 'projects',
  section: 'projects',
  xpath: './section/div[2]/div/div[1]/ul',
  li_selector: ':scope > li',
  path_list: [
    { attribute_name: 'title', path: './div/div/div[2]/div[1]/div[1]/div/div/div/div/span[1]' },

    { attribute_name: 'start_date', path: './div/div/div[2]/div[1]/div[1]/span/span[1]' },

    { attribute_name: 'end_date', path: './div/div/div[2]/div[1]/div[1]/span/span[1]' },
    {
      attribute_name: 'associated_with',
      path: "./div/div/div[2]/div[2]/ul/li[1]/div/div/div[2]/div/div/span[contains(text(), 'Associated with')][1]",
    },
    {
      attribute_name: 'description',
      path: './div/div/div[2]/div[2]/ul/li[2]/div/ul/li/div/div/div/span[1]',
    },
  ],
}
