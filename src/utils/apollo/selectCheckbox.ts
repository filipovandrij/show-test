import { imitationMoveClick } from '../imitationMoveClick'

export const selectCheckbox = async (item: Element) => {
  const checkbox = item.querySelector('input[type=checkbox]') as HTMLInputElement

  await imitationMoveClick(checkbox)
}
