export const isPlainObject = (o: unknown): o is Record<string, unknown> =>
  o != null && typeof o === 'object' && Object.getPrototypeOf(o) === Object.prototype
