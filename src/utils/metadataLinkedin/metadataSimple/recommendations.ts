export const metadataRecommendations = [
  {
    type: 'nested_list',
    fieldname: 'received',
    section: 'Recommendations',
    xpath: './div[3]/div[2]/div/ul',
    li_selector: ':scope > li',
    path_list: [
      { attribute_name: 'url', path: './div/div[2]/div[1]/a' },
      { attribute_name: 'name', path: './div/div[2]/div[1]/a/div/div/div/div/span[1]' },
      { attribute_name: 'position', path: './div/div[2]/div[1]/a/span[1]/span[1]' },
      { attribute_name: 'write_date', path: './div/div[2]/div[1]/a/span[2]/span[1]' },
      {
        attribute_name: 'content',
        path: './div/div[2]/div[2]/ul/li/div/ul/li/div/div/div/div/span[1]',
      },
    ],
  },
  {
    type: 'nested_list',
    fieldname: 'given',
    section: 'Recommendations',
    xpath: './div[3]/div[3]/div/ul',
    li_selector: ':scope > li',
    path_list: [
      { attribute_name: 'url', path: './div/div[2]/div[1]/a' },
      { attribute_name: 'name', path: './div/div[2]/div[1]/a/div/div/div/div/span[1]' },
      { attribute_name: 'position', path: './div/div[2]/div[1]/a/span[1]/span[1]' },
      { attribute_name: 'write_date', path: './div/div[2]/div[1]/a/span[2]/span[1]' },
      {
        attribute_name: 'content',
        path: './div/div[2]/div[2]/ul/li/div/ul/li/div/div/div/div/span[1]',
      },
    ],
  },
]
