export const metadataDetailHonors = {
  type: 'nested_list',
  fieldname: 'honors',
  section: 'honors',
  xpath: './section/div[2]/div/div[1]/ul',
  li_selector: ':scope > li',
  path_list: [
    { attribute_name: 'title', path: './div/div/div[2]/div[1]/div[1]/div/div/div/div/span[1]' },
    { attribute_name: 'issuer', path: './div/div/div[2]/div[1]/div[1]/span/span[1]' },
    {
      attribute_name: 'associated',
      path: "./div/div/div[2]/div[2]/ul/li/div/div/div[2]/div/div/span[1][contains(text(), 'Associated with')][1]",
    },
    // {attribute_name: 'description', path: "./div/div[2]/div[2]/ul/li/div/ul/li/div/div/div/div/span[1]"},
  ],
}
