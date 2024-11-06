export const metadataDetailJobsCompany = {
  type: 'nested_list',
  fieldname: 'jobs',
  section: 'jobs',
  xpath: './div[2]/div/div[2]/section/div[2]/ul',
  li_selector: ':scope > li',
  path_list: [
    { attribute_name: 'url', path: './div/div/div/section/div/a' },
    {
      attribute_name: 'job_name',
      path: './div/div/div/section/div/a/div[1]/div[2]/div[1]/div/span',
    },
    {
      attribute_name: 'location',
      path: './div/div/div/section/div/a/div[1]/div[2]/div[3]/div/span',
    },
  ],
}
