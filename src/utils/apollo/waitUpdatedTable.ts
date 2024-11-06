export const waitUpdatedTable = (table: HTMLTableElement) => {
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      observer.disconnect()
      resolve('table updated')
    })
    observer.observe(table, { childList: true })
  })
}
