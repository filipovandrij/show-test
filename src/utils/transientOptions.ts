export const transientOptions = {
  shouldForwardProp: (propName: string) => !propName.startsWith('$'),
}
