import { Single } from './Single'

type PathItem = {
  attribute_name: string
  path: string
}

export interface NestedList extends Single {
  li_selector: string
  path_list: (PathItem | NestedList)[]
}
