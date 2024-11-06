export const metadataDetailExperience = {
  type: 'nested_list',
  fieldname: 'experience',
  section: 'Experience',
  xpath: './section/div[2]/div/div[1]/ul',
  li_selector: ':scope > li',
  path_list: [
    { attribute_name: 'company_url', path: './div/div/div[1]/a' },
    { attribute_name: 'company_name', path: './div/div/div[2]/div[1]/div[1]/span[1]/span[1]' },
    { attribute_name: 'work_format', path: './div/div/div[2]/div[1]/div[1]/span[1]/span[1]' },
    { attribute_name: 'company_name', path: './div/div/div[2]/div[1]/a/div/div/div/div/span[1]' },
    { attribute_name: 'work_format', path: './div/div/div[2]/div[1]/a/div/div/div/div/span[1]' },
    { attribute_name: 'start_date', path: './div/div/div[2]/div[1]/div[1]/span[2]/span[1]' },
    { attribute_name: 'end_date', path: './div/div/div[2]/div[1]/div[1]/span[2]/span[1]' },
    { attribute_name: 'position', path: './div/div/div[2]/div[1]/div[1]/div/div/div/div/span[1]' },
    {
      attribute_name: 'description',
      path: './div/div[2]/div[2]/ul/li/div/ul/li/div/div/div/div/span[1][not(contains(text(), " · "))]',
    },
    {
      type: 'nested_list',
      fieldname: 'positions',
      section: 'Position',
      xpath: './div/div/div[2]/div[2]/ul/li/div/div/div[1]/ul',
      li_selector: ':scope > li',
      path_list: [
        { attribute_name: 'position', path: './div/div/div[2]/div[1]/a/div/div/div/div/span[1]' },
        { attribute_name: 'work_format', path: './div/div/div[2]/div[1]/a/span[1]/span[1]' },
        { attribute_name: 'start_date', path: './div/div[2]/div[1]/a/span[2]/span[1]' },
        { attribute_name: 'end_date', path: './div/div[2]/div[1]/a/span[2]/span[1]' },
        { attribute_name: 'location', path: './div/div[2]/div[1]/a/span[3]/span[1]' },
        {
          attribute_name: 'description',
          path: './div/div[2]/div[2]/ul/li/div/ul/li/div/div/div/div/span[1][not(contains(text(), " · "))]',
        },
      ],
    },
  ],
}
