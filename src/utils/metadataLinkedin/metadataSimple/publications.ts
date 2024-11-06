export const metadataPublications = {
  type: 'nested_list',
  fieldname: 'publications',
  section: 'Publications',
  xpath: './div[3]/ul',
  li_selector: ':scope > li',
  path_list: [
    { attribute_name: 'title', path: './div/div[2]/div[1]/div[1]/div/div/div/div/span[1]' },
    { attribute_name: 'date', path: './div/div[2]/div[1]/div[1]/span/span[1]' },
    { attribute_name: 'link', path: './div/div[2]/div[2]/ul/li[1]/div/div/a' },
    {
      attribute_name: 'skills',
      path: './div/div[2]/div[2]/ul/li/div/ul/li/div/div/div/div/span[strong][1]',
    },
    {
      attribute_name: 'description',
      path: './div/div[2]/div[2]/ul/li[2]/div/ul/li/div/div/div/div/span[1]',
    },
  ],
}
