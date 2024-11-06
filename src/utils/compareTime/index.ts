const convertToSeconds = (number: number, timeUnit: string) => {
  switch (timeUnit) {
    case 'sec':
      return number
    case 'h':
      return number * 3600
    case 'd':
      return number * 86400
    case 'w':
      return number * 86400 * 7
    case 'mo':
      return number * 86400 * 30
    case 'y':
      return number * 86400 * 365
    default:
      return 1
  }
}

export const compareTimeString = (date: string, needDate = '1mo') => {
  const timePattern = /[a-zA-Z]+/

  const numberDate = parseInt(date, 10)
  const numberNeedDate = parseInt(needDate, 10)

  const datePatterns = date.match(timePattern)
  const needDatePatterns = needDate.match(timePattern)

  let dateUnit = '1h'
  let needDateUnit = '1h'

  if (datePatterns) {
    dateUnit = datePatterns[0]
  }
  if (needDatePatterns) {
    needDateUnit = needDatePatterns[0]
  }

  return convertToSeconds(numberNeedDate, needDateUnit) < convertToSeconds(numberDate, dateUnit)
}
