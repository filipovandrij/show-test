import { deepEqual } from './deepEqual'
import { isPlainObject } from './isPlainObject'

const isEmpty = (o: Object) => Object.keys(o).length === 0
const hasOwnProperty = (o: Object, key: string) => Object.prototype.hasOwnProperty.call(o, key)
export const isEmptyObject = (o: unknown) => isPlainObject(o) && isEmpty(o)

export const diff = <
  T extends Record<string, unknown> | unknown,
  K extends Record<string, unknown> | unknown
>(
  initial: T,
  updated: K
): Partial<K & T> => {
  if (!isPlainObject(initial) || !isPlainObject(updated)) {
    if (deepEqual(updated, initial)) return {}

    return updated as Partial<K & T>
  }
  const deletedValues = Object.keys(initial).reduce((acc, key) => {
    if (!hasOwnProperty(updated, key)) {
      acc[key as keyof Partial<K & T>] = undefined
    }

    return acc
  }, {} as Partial<K & T>)

  return Object.keys(updated).reduce((acc, key) => {
    if (!hasOwnProperty(initial, key)) return { ...acc, [key]: updated[key] }

    const difference = diff(initial[key], updated[key])

    if (isEmptyObject(difference)) return acc

    return { ...acc, [key]: difference }
  }, deletedValues)
}
