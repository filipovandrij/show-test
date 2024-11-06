export interface Email {
    email: string,
    id: number,
    last_sync_time: string | null,
    last_update_time: string | null,
    received_emails: number,
    service: 'gmail' | 'outlook',
    status: EmailApiStatus,
    total_emails: number,
    total_labeled_emails: number,
    daily: {
      [key: string]: StatisticUnit;
    },
    weekly: {
      [key: string]: StatisticUnit;
    },
    monthly: {
      [key: string]: StatisticUnit;
    }
  }

export interface StatisticUnit {
    received: number,
    sent_by_system: number,
    sent_by_user: number,
    first_time: number,
    follow_up: number,
    no_label: number,
    label_important: number
  }

export interface EmailSettings {
    account_id: string,
    account_status: AccountStatus,
    account_type: 'gmail' | 'outlook' | 'linkedin' | 'apollo' | 'openAI',
    last_active?: string | null,
    last_verified?: string | null,
    updated_at?: string,
    settings: {
      send_from_this_account: boolean,
      daily_limits: {
          new_addresses: {
          max_emails_per_day: number
          },
          total_from_account: {
          max_emails_per_day: number
          }
      },
      email_rate_limits: {
          max_emails_per_hour: number,
          max_emails_per_three_hours: number,
          min_delay_between_emails_seconds: number,
          max_delay_between_emails_seconds: number
      },
      weekly_schedule: {
          monday?: { start_time: string, end_time: string },
          tuesday?: { start_time: string, end_time: string },
          wednesday?: { start_time: string, end_time: string },
          thursday?: { start_time: string, end_time: string },
          friday?: { start_time: string, end_time: string },
          saturday?: { start_time: string, end_time: string },
          sunday?: { start_time: string, end_time: string }
      },
      manual_email_dispatch: boolean,
      unapproved_emails_policy: {
          save_to_drafts_if_unapproved: boolean,
          send_automatically_after_delay: boolean
      }
    }
  }

export type AccountStatus = 'active' | 'stand_by' | 'offline' | 'logged out' | 'error' | 'deleted'

export type EmailApiStatus = 'in_progress' | 'completed' | 'failed' | 'queued'