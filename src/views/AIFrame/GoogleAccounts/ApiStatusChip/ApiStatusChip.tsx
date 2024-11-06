import DoneIcon from '@mui/icons-material/Done'
import HistoryIcon from '@mui/icons-material/History'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import { Email } from '../types'

interface Props {
    email: Email
}

export const ApiStatusChip = ({ email }: Props) => {
    dayjs.extend(isToday)

    return (
        <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {
                email.status == 'in_progress' ?
                <HistoryIcon sx={{ color: '#ACACAC', fontSize: '12px' }} /> :
                email.status == 'completed' ?
                <DoneIcon sx={{ color: '#4CAF50', fontSize: '12px' }} /> :
                email.status == 'failed' ?
                <ReportProblemIcon sx={{ color: '#B3261E', fontSize: '12px' }} /> :
                <AccessAlarmIcon sx={{ color: '#ACACAC', fontSize: '12px' }}/>
            }
            <Typography
                sx={{
                fontFamily: 'Roboto',
                fontSize: '12px',
                fontWeight: '400',
                lineHeight: '16px',
                color: '#757575'
                }}
            >
                {
                    email.status == 'in_progress' ?
                    'Processing emails' :
                    email.status == 'completed' ?
                    'Last sync' :
                    email.status == 'failed' ?
                    'Processing failed' :
                    'Awaiting in queue'
                }
            </Typography>
            {email.last_sync_time &&
            <Typography
                sx={{
                fontFamily: 'Roboto',
                fontSize: '12px',
                fontWeight: '400',
                lineHeight: '16px',
                color: '#797979'
                }}
            >
                { dayjs(email.last_sync_time).format('HH:mm') }
                { dayjs(email.last_sync_time).isToday() ?
                ' Today' :
                <>
                    {' on '} {dayjs(email.last_sync_time).format('DD.MM')}
                </>}
            </Typography>
            }
        </Box>
    )
}