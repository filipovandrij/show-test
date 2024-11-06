export type GptSession = {
  accessToken?: string
  authProvider?: string
  /** @example "2024-02-19T11:57:42.564Z" */
  expires?: string
  user?: {
    email?: string
    groups?: unknown[]
    iat?: number
    id?: string
    idp?: string
    /** link */
    image?: string
    intercom_hash?: string
    mfa?: boolean
    name?: string
    /** link */
    picture?: string
  }
}
