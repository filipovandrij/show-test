import { isString } from './isString'
import { isValidDate } from './isValidDate'

export const isDateFormatString = (value: unknown): value is string =>
  isString(value) && isValidDate(new Date(value))
