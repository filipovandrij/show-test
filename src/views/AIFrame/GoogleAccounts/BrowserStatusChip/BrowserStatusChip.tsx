import { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import { Chip, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material'
import { AccountStatus, EmailSettings } from '../types'
import { getBaseUrl } from '../../../../api/baseUrl'
import { getToken } from '../../../../api/getToken'

type STATUS = 'Active' | 'Off' | 'No access'

const COLORS = {
    thisSessionActive: '#1E4620',
    otherSessionActive: '#9AAC9B',
    off: '#663D00',
    noAccess: '#B3261E'
}

const BG_COLORS = {
    thisSessionActive: '#EDF7ED',
    otherSessionActive: '#F7FBF7',
    off: '#FFF5E5',
    noAccess: '#F9DEDC',
}

const NO_ACCESS_TEXT = 'The access to the mailbox is lost, and mailing is stopped. Please, log in to continue'
const OFF_TEXT = 'There is no mailbox connection data. Mailing is stopped. Please, log in to continue'

interface Props {
    emailSettings?: EmailSettings,
    sessionLoggedIn: boolean,
}

export const BrowserStatusChip = ({ emailSettings, sessionLoggedIn }: Props) => {
    const [status, setStatus] = useState<STATUS>('Off')
    const [color, setColor] = useState<string>(COLORS.off)
    const [bgColor, setBgColor] = useState<string>(BG_COLORS.off)
    const [updatedAt, setUpdatedAt] = useState<string>(emailSettings?.updated_at || '')
    const [tooltipText, setTooltipText] = useState(OFF_TEXT)

    useEffect(() => {
        setUpdatedAt(emailSettings?.updated_at || '')

        if (emailSettings?.settings &&
            Object.hasOwn(emailSettings.settings, 'send_from_this_accoung') &&
            !emailSettings?.settings?.send_from_this_account) {
            setStatus('Off')
            setColor(COLORS.off)
            setBgColor(BG_COLORS.off)
            return
        }

        switch (emailSettings?.account_status) {
            case 'offline':
                setStatus('Off')
                setColor(COLORS.off)
                setBgColor(BG_COLORS.off)
                break
            case 'logged out':
                setStatus('No access')
                setColor(COLORS.noAccess)
                setBgColor(BG_COLORS.noAccess)
                break
            case 'active':
                chooseActiveStatus()
                break
            default:
                setStatus('Active')
                setColor(COLORS.thisSessionActive)
                setBgColor(BG_COLORS.thisSessionActive)
        }
    }, [emailSettings])

    useEffect(() => {
        if ((status == 'No access' || (status == 'Off' && emailSettings?.settings?.send_from_this_account)) && sessionLoggedIn) {
            setStatus('Active')
            setColor(COLORS.thisSessionActive)
            setBgColor(BG_COLORS.thisSessionActive)
            updateStatus('active')

            chrome.storage.session.get(['thisSessionLoggedInGmails'], (res) => {
                if (Object.keys(res).length == 0) {
                    chrome.storage.session.set({ thisSessionLoggedInGmails: [emailSettings?.account_id] })
                    return
                }
                if (!res.includes(emailSettings?.account_id)) {
                    chrome.storage.session.set({ thisSessionLoggedInGmails: [...res.thisSessionLoggedInGmails, emailSettings?.account_id] })
                }
            })
        }
    }, [sessionLoggedIn])

    useEffect(() => {
        switch (status) {
            case 'Active':
                setTooltipText(`Last visited service and obtained authorization on 
                ${dayjs(updatedAt).format('DD.MM')} at 
                ${dayjs(updatedAt).format('HH:mm')}`)
                break
            case 'Off':
                setTooltipText(OFF_TEXT)
                break
            case 'No access':
                setTooltipText(NO_ACCESS_TEXT)
                break
            default:
                setTooltipText(OFF_TEXT)
        }
    }, [status, updatedAt])

    function chooseActiveStatus() {
        if (emailSettings?.account_type == 'openAI') {
            setStatus('Active')
            setColor(COLORS.thisSessionActive)
            setBgColor(BG_COLORS.thisSessionActive)
            return
        }
        chrome.storage.session.get(['thisSessionLoggedInGmails'], (res) => {
            if (Object.keys(res).length == 0 ||
                !res.thisSessionLoggedInGmails.includes(emailSettings?.account_id)) {
                setStatus('Active')
                setColor(COLORS.otherSessionActive)
                setBgColor(BG_COLORS.otherSessionActive)
            }
        })
    }

    async function updateStatus(status: AccountStatus) {
        const baseUrl = await getBaseUrl()
        const token = await getToken()
        const url = `${baseUrl}/api/constructor/planner/settings/`
        const data : any = {
            account_id: emailSettings?.account_id,
            account_type: emailSettings?.account_type,
            account_status: status
        }
        const headers = {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        try {
            const response = await axios.patch<EmailSettings>(url, data, headers)
            setUpdatedAt(response.data.updated_at || '')
            return response.data
        } catch (error: any) {
            console.error('An error occurred:', error)
        }
    }

    const NoMaxWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))({
        [`& .${tooltipClasses.tooltip}`]: {
          maxWidth: 'none',
          marginRight: '20px'
        },
      })

    return (
    <NoMaxWidthTooltip title={tooltipText}>
        <Chip label={status} sx={{
            backgroundColor: bgColor,
            color,
            fontFamily: 'Roboto',
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.5px',
            fontWeight: '600',
            marginLeft: 'auto',
            marginRight: '40px' }}
        />
    </NoMaxWidthTooltip>
    )

}