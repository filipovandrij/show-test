export const metadataVolunteering = {
  type: 'nested_list',
  fieldname: 'Volunteering',
  section: 'Volunteering',
  xpath: './div[3]/ul',
  li_selector: ':scope > li',
  path_list: [
    { attribute_name: 'organization ', path: './div/div[2]/div/div[1]/span[1]/span[1]' },
    { attribute_name: 'role', path: './div/div[2]/div/div[1]/div/div/div/div/span[1]' },
    { attribute_name: 'date', path: './div/div[2]/div/div[1]/span[2]/span[1]' },
    { attribute_name: 'cause', path: './div/div[2]/div/div[1]/span[3]/span[1]' },
    { attribute_name: 'description', path: './div/div[2]/div[2]/ul/li/div/div/div/div/span[1]' },
  ],
}
