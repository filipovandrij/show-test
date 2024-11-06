import { getToken } from '../../api/getToken'
import { getBaseUrl } from '../../api/baseUrl'
import { getState, setState } from '../state'

const findMe = async (findUrl: string) => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()
  const url = `${baseUrl}/api/elt/get_json_data/?specific_key=${findUrl}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Сетевой ответ был не ok.')
    }

    const json = await response.json()
    console.log(json)
    return json
  } catch (error) {
    console.error('Произошла ошибка при выполнении запроса:', error)
    throw error
  }
}

export async function changeNames(storage: any = 'localStorage') {
  const currentState = await getState(storage)

  if (!currentState.linkAnalyzer) {
    console.error('linkAnalyzer is undefined')
    return
  }

  for (const analyzer of currentState.linkAnalyzer) {
    const { formState, fields } = analyzer

    // Находим поля, которые нужно обновить, основываясь на их title
    const fieldsToUpdate = fields.filter(
      (field) => field.title === 'Job Description' || field.title === 'Candidate'
    )

    if (formState)
      for (const field of fieldsToUpdate) {
        const fieldName = field.name
        const fieldData = formState[fieldName]

        if (fieldData?.specific_key) {
          const content = fieldData.specific_key.content

          if (content) {
            try {
              // eslint-disable-next-line no-await-in-loop
              const newData = await findMe(content)

              if (!newData.title) {
                console.error('newData.title не существует для', fieldName)
                continue // Пропускаем текущую итерацию цикла
              }
              // Обновляем title в найденном поле
              field.title = newData.title

              // Дополнительная логика для обновления имени анализатора
              if (fieldName === 'jobDescription' && field.title !== 'Job Description') {
                analyzer.name = field.title
              }
            } catch (error) {
              console.error('Ошибка при обновлении title:', error)
            }
          }
        }
      }
  }

  await setState({ ...currentState }, storage)
}
