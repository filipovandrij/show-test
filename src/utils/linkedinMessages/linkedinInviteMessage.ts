import { timer } from '../timer'
import { getRandomInt } from '../getRandomInt'

export const linkedinInviteMessage = async (message: string) => {
	const connectBtn = document.querySelector('div[aria-label*=Invite]') as HTMLElement
	connectBtn.click()
	await timer(getRandomInt(300, 500))

	const noteBtn =  document.querySelector('button[aria-label="Add a note"]') as HTMLElement
	noteBtn.click()
	await timer(getRandomInt(500, 800))

	const textAreaMessage = document.getElementById('custom-message') as HTMLTextAreaElement
	textAreaMessage.value = message

	const sendBtn =  document.querySelector('button[aria-label="Send now"]') as HTMLElement
	sendBtn.removeAttribute('disabled')
	sendBtn.className = 'artdeco-button artdeco-button--2 artdeco-button--primary ember-view ml1'
	// sendBtn.click()
}