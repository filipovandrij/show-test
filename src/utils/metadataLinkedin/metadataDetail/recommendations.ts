export const metadataDetailRecommendations = {
  type: 'nested_list',
  fieldname: 'recommendations',
  section: 'Recommendations',
  xpath: './section/div[2]/div[2]/div/div/div[1]/ul',
  li_selector: ':scope > li',
  path_list: [
    {
      attribute_name: 'recommender_name',
      path: './div/div/div[2]/div[1]/a/div/div/div/div/span[1]',
    },
    { attribute_name: 'recommender_position', path: './div/div/div[2]/div[1]/a/span[1]/span[1]' },
    { attribute_name: 'date_desc', path: './div/div/div[2]/div[1]/a/span[2]/span[1]' },
    {
      attribute_name: 'content',
      path: './div/div/div[2]/div[2]/ul/li/div/ul/li/div/div/div/span[1]',
    },
  ],
}
