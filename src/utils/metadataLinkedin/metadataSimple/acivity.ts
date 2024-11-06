export const metadataActivity = {
  type: 'nested_list',
  fieldname: 'activity',
  section: 'activity',
  xpath: './div[4]/div/div/div[1]/ul',
  li_selector: ':scope > li',
  path_list: [
    { attribute_name: 'reposted_by', path: './div/div/a/div/span/span[1]/strong' },
    { attribute_name: 'content', path: './div/div/div/a/div/span[1]' },
    { attribute_name: 'date', path: './div/div/a/div/span/span[2]' },
  ],
}
