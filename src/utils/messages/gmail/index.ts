import { getRandomInt } from '../../getRandomInt'
import { timer } from '../../timer'
import { TMessage } from '../models'

export const messageGmail = async ({ title, email, message } : TMessage) => {
  const writeBtn = document.querySelector('.T-I.T-I-KE.L3') as HTMLElement
  writeBtn.click()
  await timer(getRandomInt(800, 1100))

  const titleInput = document.querySelector('input[name=subjectbox]') as HTMLInputElement
  if (titleInput) {
    titleInput.value = title

    const emailInput = document.querySelector('input[role=combobox]') as HTMLInputElement
    emailInput.value = email

    const body = document.querySelector('.editable') as HTMLElement
    body.innerHTML = `<div>${message}</div>`

    // const sendBtn = document.querySelector('.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3') as HTMLElement
    // sendBtn.click()
  }
}
