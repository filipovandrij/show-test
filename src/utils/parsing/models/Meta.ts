import { Single } from './Single'
import { NestedList } from './NestedList'
import { List } from './List'

export type Field = Single | NestedList | List

export interface Meta {
  parse_fields: Field[]
}
