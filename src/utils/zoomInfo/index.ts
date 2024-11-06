import { getRandomInt } from '../getRandomInt'
import { timer } from '../timer'
import api from '../../api'

const COUNT_ON_PAGE = 25

const parseInfo = async (row: Element, id: number, guid: string) => {
	const cols = row.querySelectorAll('td')
	const idContact = cols[1].querySelector('a')?.getAttribute('data-zoominfo-id')
	const fullName = cols[1].querySelector('span')?.innerText.trim()
	const companyName = cols[5].innerText.trim()

	const arrow = row.querySelector('[aria-label="contact details"] i')?.parentNode?.parentNode as Element

	if (arrow) {
		arrow.scrollIntoView()

		// Создаем новое событие mouseenter
		const mouseEnterEvent = new MouseEvent('mouseenter', {
			bubbles: true, // Разрешаем всплытие события
			cancelable: true, // Разрешаем отмену события
		})

		const clickEvent = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
		})

		arrow.dispatchEvent(mouseEnterEvent)
		arrow.dispatchEvent(clickEvent)

		await timer(getRandomInt(1500, 3000))

		const mailAnchor = document.querySelector('[href^="mailTo:"]')
		const phonesAnchor = document.querySelectorAll('[href^="tel:"]')

		const email = mailAnchor?.ariaLabel?.trim()
		const phones = []

		for (let i = 0; i < phonesAnchor.length; i++) {
			phones.push(phonesAnchor[i]?.ariaLabel?.trim())
		}

		const json_data = {
			email,
			phones,
			full_name: fullName,
			company_name: companyName
		}

		api.savingData({
			source: 'zoominfo',
			entity: 'profile',
			specific_key: `https://app.zoominfo.com/#/apps/profile/person/${idContact}/contact-profile`,
			import_number: id,
			json_data,
			guid
		})

		arrow.scrollIntoView()

		arrow.dispatchEvent(mouseEnterEvent)
		arrow.dispatchEvent(clickEvent)

		await timer(getRandomInt(2500, 4500))
	}
}

export const parseZoomInfo = async (
	counts: number,
	idImport: number,
	guid: string,
	// eslint-disable-next-line no-unused-vars
	minDelay: number,
	// eslint-disable-next-line no-unused-vars
	maxDelay: number
) => {
	const pages = Math.ceil(counts / COUNT_ON_PAGE)

	// eslint-disable-next-line no-labels
	pagesLoop: for (let i = 0; i < pages; i++) {
		const rows = document.querySelectorAll('table tbody tr')

		for (let j = 0; j < rows.length; j++) {
			const row = rows[j]
			// eslint-disable-next-line no-await-in-loop
			await parseInfo(row, idImport, guid)

			if (i * COUNT_ON_PAGE + j + 1 == counts) {
				// eslint-disable-next-line no-labels
				break pagesLoop
			}

			// eslint-disable-next-line no-await-in-loop
			await timer(getRandomInt(3000, 5000))
		}

		const nextBtn = document.querySelector('.p-paginator-icon.pi.pi-angle-right')
		if (nextBtn != null) {
			(nextBtn as HTMLButtonElement).click()

			// eslint-disable-next-line no-await-in-loop
			await timer(getRandomInt(5000, 7000))
		}
	}
}
