import { xpath } from '../xpath'
import { getRandomInt } from '../getRandomInt'
import { timer } from '../timer'

export const linkedinMessage = async (message: string) => {
	const main = document.querySelector('main') as HTMLElement
	const messageBtn = xpath('.//button[contains(@aria-label, "Message")]', main) as HTMLElement

	messageBtn.click()
	await timer(getRandomInt(500, 800))

	const chat = document.querySelector('.msg-convo-wrapper') as HTMLElement
	const inputMessage = chat.querySelector('.msg-form__contenteditable') as HTMLElement
	const placeholder = chat.querySelector('.msg-form__placeholder') as HTMLElement

	placeholder.className = 't-14 t-black--light t-normal'

	inputMessage.innerHTML = `<p>${message}</p>`

	const sendBtn = chat.querySelector('.msg-form__send-button') as HTMLElement
	sendBtn.removeAttribute('disabled')
	// sendBtn.click()
}
