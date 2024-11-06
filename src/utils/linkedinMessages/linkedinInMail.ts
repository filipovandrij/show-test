import { timer } from '../timer'
import { getRandomInt } from '../getRandomInt'

export const linkedinInMail= async (subject: string, message: string) => {
	const messageBtn = document.querySelector('.entry-point > button') as HTMLElement

	messageBtn.click()
	await timer(getRandomInt(500, 800))

	const inputSubject = document.querySelector('.artdeco-text-input--input') as HTMLInputElement
	inputSubject.value = subject

	const inputMessage = document.querySelector('.msg-form__contenteditable') as HTMLElement
	inputMessage.innerHTML = `<p>${message}</p>`

	const sendBtn = document.querySelector('.msg-form__send-button') as HTMLButtonElement
	sendBtn.removeAttribute('disabled')
	// sendBtn.click()
}