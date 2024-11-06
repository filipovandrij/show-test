export const callMaybeFunction = <F extends (...args: any) => any>(
  fn: F | undefined,
  ...params: Parameters<F>
) => {
  if (fn) {
    return fn(...(params as Parameters<F>[])) as ReturnType<F>
  }
}
