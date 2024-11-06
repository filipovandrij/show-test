export const metadataInterests = {
  type: 'nested_list',
  fieldname: 'interests',
  section: 'interests',
  xpath: './div[3]/div[2]/div/ul',
  li_selector: ':scope > li',
  path_list: [
    { attribute_name: 'url', path: './div/div[2]/div[1]/a' },
    { attribute_name: 'name', path: './div/div[2]/div[1]/a/div/div[1]/div/div/span[1]' },
    { attribute_name: 'followers', path: './div/div[2]/div[1]/a/span[2]/span[1]' },
    { attribute_name: 'position', path: './div/div[2]/div[1]/a/span[1]/span[1]' },
  ],
}
