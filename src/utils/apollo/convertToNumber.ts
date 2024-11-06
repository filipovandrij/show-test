export const convertToNumber = (str: string) => {
  const millionRegex = /^([\d.]+)M$/
  const commaSeparatedRegex = /^([\d,]+)$/
  const plainNumberRegex = /^([\d.]+)$/

  if (millionRegex.test(str)) {
    const matches = str.match(millionRegex)
    if (matches) return parseFloat(matches[1]) * 1000000
  } else if (commaSeparatedRegex.test(str)) {
    return parseFloat(str.replace(/,/g, ''))
  } else if (plainNumberRegex.test(str)) {
    return parseFloat(str)
  }
  return 0
}
