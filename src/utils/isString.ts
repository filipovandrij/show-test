export const isString = (value: unknown): value is string =>
  Object.prototype.toString.call(value) === '[object String]'
