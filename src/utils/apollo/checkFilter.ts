export const checkFilter = () => {
  if (document.querySelector('.zp_qvvEC')) {
    const filterBtn = document.querySelector(
      '[data-cy="finder-filter-button"]'
    ) as HTMLButtonElement
    filterBtn.click()
  }
}
