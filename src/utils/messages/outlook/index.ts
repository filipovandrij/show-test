import { getRandomInt } from '../../getRandomInt'
import { timer } from '../../timer'
import { TMessage } from '../models'

export const messageOutlook = async ({ title, email, message } : TMessage) => {
	const writeBtn = document.querySelector('.splitPrimaryButton') as HTMLElement
	writeBtn.click()
	await timer(getRandomInt(800, 1100))

	const emailInput = document.querySelector('.EditorClass') as HTMLElement
	if (emailInput) {
		emailInput.innerText = email

		const titleInput = document.querySelector('.ms-TextField-field') as HTMLInputElement
		titleInput.value = title
		titleInput.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }))
		titleInput.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true }))
		titleInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }))
		titleInput.dispatchEvent(new Event('input', { bubbles: true }))
		titleInput.dispatchEvent(new Event('change', { bubbles: true }))

		const body = document.querySelector('[role="textbox"] > div') as HTMLElement
		body.innerText = message

		// const sendBtn = document.querySelector('button[aria-describedby*="sendSplitButton"]') as HTMLElement
		// sendBtn.click()
	}
}
