export const metadataOrganizations = {
  type: 'nested_list',
  fieldname: 'organizations',
  section: 'organizations',
  xpath: './div[3]/ul',
  li_selector: ':scope > li',
  path_list: [
    { attribute_name: 'name', path: './div/div[2]/div[1]/div[1]/div/div/div/div/span[1]' },
    { attribute_name: 'info', path: './div/div[2]/div[1]/div[1]/span/span[1]' },
    {
      attribute_name: 'description',
      path: './div/div[2]/div[2]/ul/li/div/ul/li/div/div/div/div/span[1]',
    },
  ],
}
