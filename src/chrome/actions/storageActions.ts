export type Storage = 'localStorage' | 'bg'

export const actionsByStorage = {
  localStorage: {
    get_state: 'get_state',
    app_state_update: 'app_state_update',
  },
  bg: {
    get_state: 'bg_get_state',
    app_state_update: 'bg_app_state_update',
  },
} as const
