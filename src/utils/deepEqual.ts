export const deepEqual = (a: unknown, b: unknown): boolean => {
  const firstType = typeof a
  const secontType = typeof b

  if (firstType !== secontType) return false
  if (firstType === 'number' && Number.isNaN(a) && Number.isNaN(b)) return true
  if (firstType === 'object') {
    if (a === null || b === null) return a === b

    const isArrayFirst = Array.isArray(a)
    const isArraySecond = Array.isArray(b)
    if (isArrayFirst && isArraySecond && a.length === b.length) {
      return a.every((el, i) => deepEqual(el, b[i]))
    }

    const isPlainObjectFirst = Object.getPrototypeOf(a) === Object.prototype
    const isPlainObjectSecond = Object.getPrototypeOf(b) === Object.prototype
    if (
      isPlainObjectFirst &&
      isPlainObjectSecond &&
      typeof a === 'object' &&
      typeof b === 'object'
    ) {
      const firstKeys = Object.keys(a)
      const secondKeys = Object.keys(b)
      if (firstKeys.length === secondKeys.length) {
        return firstKeys.every((key) => {
          const firstHasProperty = Object.prototype.hasOwnProperty.call(a, key)
          const secondHasProperty = Object.prototype.hasOwnProperty.call(b, key)
          if (firstHasProperty === secondHasProperty) {
            if (firstHasProperty && secondHasProperty) {
              return deepEqual(a[key as keyof typeof a], b[key as keyof typeof b])
            }
            return true
          }
          return false
        })
      }
      return false
    }

    if (a instanceof Date && b instanceof Date) {
      return a.toString() === b.toString()
    }
  }

  return a === b
}
