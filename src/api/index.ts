/* eslint-disable  */
import { getToken } from './getToken'
import { setToken } from './setToken'
import { AnalyzeEntity, PromptQueueAnswer, PromptQueueItem } from '../types'
import { getBaseUrl } from './baseUrl'

const fetcher = async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
  const options = init || {}
  const headers = new Headers(options.headers)

  headers.append('Authorization', `Bearer ${await getToken()}`)

  options.headers = headers

  const response = await fetch(input, options)

  if (response.status === 401) {
    const responseRefresh = await fetch(`${await getBaseUrl()}/api/token/refresh/?format=json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: await getToken(),
      }),
    })

    if (responseRefresh.status === 401 || responseRefresh.status === 400) {
      await setToken(null)
      return response
    }

    const data = await responseRefresh.json()
    await setToken(data.token)

    return fetch(input, options)
  }

  return response
}

class API {
  private baseUrl!: string

  constructor() {
    getBaseUrl().then((url) => {
      this.baseUrl = url
    })
  }

  async getMeta(linkedinUrl: string) {
    const url = (await getBaseUrl()) + '/api/metadata/?'
    const response = await fetcher(
      url +
        new URLSearchParams({
          user_url: linkedinUrl,
          format: 'json',
        })
    )

    return response.json()
  }

  async sendParsedData(data: any) {
    const fetchedUrl = (await getBaseUrl()) + '/api/linkedin-data/'

    let responseFromServer = await fetcher(fetchedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  async getTemplates() {
    const url = (await getBaseUrl()) + '/api/prompt-templates/?format=json'
    let response = await fetcher(url)

    return await response.json()
  }

  async getPrompt(linkedinUrl: string, templateId: number) {
    const url = (await getBaseUrl()) + '/api/get-user-prompt/?'
    let response = await fetcher(
      url +
        new URLSearchParams({
          user_url: linkedinUrl,
          template_id: `${templateId}`,
          format: 'json',
        })
    )

    return await response.json()
  }

  async sendPrompt(prompt: string) {
    const url = (await getBaseUrl()) + '/api/send-prompt/?format=json'
    let response = await fetcher(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    })

    const data = await response.json()
    return data.response
  }

  async auth(username: string, password: string) {
    const url = (await getBaseUrl()) + '/api/token/?format=json'

    const response = await fetcher(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail)
    }

    const data = await response.json()
    return data.access
  }

  async verifyToken() {
    const token = await getToken()

    const url = (await getBaseUrl()) + '/api/token/verify/?format=json'

    const res = await fetcher(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
      }),
    })

    !res.ok && (await setToken(null))
  }

  async googleAuth(tokenId: string) {
    const url = (await getBaseUrl()) + '/api/google-auth/?format=json'
    const response = await fetcher(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_token: tokenId,
      }),
    })

    const data = await response.json()
    return data.token
  }

  async savingData(data: any) {
    const url = (await getBaseUrl()) + '/api/data-parsing/?format=json'
    return fetcher(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  async startParseCompany(companyName: string, companyUrl: string) {
    const url = (await getBaseUrl()) + '/api/parser/company-info/?format=json'
    const response = await fetcher(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_name: companyName,
        company_website: companyUrl,
      }),
    })
  }

  gmailData = async ({ fields, email }: { fields: { [k: string]: string[] }; email: string }) =>
    fetcher(
      `${await getBaseUrl()}/google_data_for_extension/?${new URLSearchParams({
        email,
        ...Object.fromEntries(
          Object.entries(fields).map(([field_key, fields]) => [field_key, fields.join(',')])
        ),
      })}`
    ).then((r) => r.json() as Promise<{ value?: string; error?: string }>)

  async updateGSheets() {
    const url = (await getBaseUrl()) + '/api/sheets/update/?format=json'
    const response = await fetcher(url)
  }

  async createGSheets(email: string) {
    const url = (await getBaseUrl()) + '/api/sheets/create/?format=json'
    const response = await fetcher(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error)

    return data.message
  }

  async uploadCSV(formData: any) {
    const url = (await getBaseUrl()) + '/api/upload_csv/'
    const response = await fetcher(url, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
  }

  async analyzeCandidates(vacancy: AnalyzeEntity, candidates: AnalyzeEntity[], prompt: string) {
    const url = (await getBaseUrl()) + '/api/analyze-candidates/'
    const response = await fetcher(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vacancy: vacancy,
        candidates: candidates,
        prompt: prompt,
      }),
    })
    return response
  }

  async getGsheetsUrl() {
    const url = (await getBaseUrl()) + '/api/sheets/get_url/?format=json'
    return await fetcher(url)
  }

  async getPromptQueueItem(models: string[]): Promise<PromptQueueItem[] | number> {
    const lookLocal = async (): Promise<any> => {
      return new Promise((resolve) => {
        chrome.storage.local.get(['accGpts'], (result) => {
          if (result.accGpts) {
            return resolve(result.accGpts)
          }
          return resolve(null)
        })
      })
    }

    try {
      const baseUrl = await getBaseUrl()
      const url = `${baseUrl}/api/constructor/planner/run_list/`

      const listAccGpts = await lookLocal()

      if (!listAccGpts) {
        return []
      }

      const activeAccount = listAccGpts.find((account: any) => account.account_status === 'active')

      const response = await fetcher(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          available_models: models,
          openai_account_id: activeAccount.account_id,
        }),
      })

      if (response.status === 200) {
        return await response.json()
      } else if (response.status === 429) {
        const { retry_after_seconds } = await response.json()
        return retry_after_seconds
      } else {
        return []
      }
    } catch (e) {
      return []
    }
  }

  async sendPromptQueueAnswer(answer: PromptQueueAnswer[]) {
    const baseUrl = await getBaseUrl()
    const url = `${baseUrl}/api/constructor/planner/save_answer_bulk/`
    const response = await fetcher(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(answer),
    })
    return response
  }
}

const api = new API()
export default api
