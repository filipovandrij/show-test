export const isValidDate = (value: unknown): value is Date =>
  Object.prototype.toString.call(value) === '[object Date]' && String(value) !== 'Invalid Date'
