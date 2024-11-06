export const metadataSimpleJobsCompany = {
  type: 'nested_list',
  fieldname: 'jobs',
  section: 'jobs',
  xpath: './div/div',
  li_selector: ':scope > div',
  path_list: [
    { attribute_name: 'url', path: './a' },
    { attribute_name: 'job_name', path: './a/div/div/h3' },
    { attribute_name: 'location', path: './a/div/div/span' },
  ],
}
