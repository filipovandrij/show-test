import { FC, useCallback, useContext, useMemo } from 'react'
import { styled } from '@mui/system'
import { Box, Typography } from '@mui/material'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import { isDateFormatString } from '../../../../../utils/isDateFormatString'
import { Conversation } from '../../../../../chrome/gptApi/model'
import { GptContext } from '../../context/GptContextProvider'

const ConverstionsList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
`

const ConversationWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  cursor: pointer;
`

const Title = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
`

const PeriodTitle = styled(Typography)`
  color: #000;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
`

const Timestamp = styled(Typography)`
  color: #d8d8d8;
  font-family: Axiforma;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`

const getFormatedDateTime = (dateString: unknown) => {
  if (!isDateFormatString(dateString)) return 'Invalid date'
  const format = (n: number) => (n > 9 ? n : `0${n}`)
  const date = new Date(dateString)

  return String.raw`${format(date.getDate())}.${format(
    date.getMonth() + 1
  )}.${date.getFullYear()} ${format(date.getHours())}:${format(date.getMinutes())}`
}

const periods = ['7_DAYS', '30_DAYS', 'OLDER'] as const

const periodsTitles: { [k in (typeof periods)[number]]: string } = {
  '7_DAYS': 'Previous 7 days',
  '30_DAYS': 'Previous 30 days',
  OLDER: 'Older',
}

const getPeriod = (dateString: unknown): (typeof periods)[number] => {
  if (!isDateFormatString(dateString)) return 'OLDER'
  const daysDiff = Math.ceil((+new Date() - +new Date(dateString)) / 1000 / 3600 / 24)
  return daysDiff < 8 ? '7_DAYS' : daysDiff < 31 ? '30_DAYS' : 'OLDER'
}

export const History: FC<{ converstionsList: Conversation[] }> = ({ converstionsList }) => {
  const { setConversationId, setView } = useContext(GptContext)
  const onConversationClick = useCallback(
    (id: string) => {
      setConversationId(id)
      setView('Chat')
    },
    [setConversationId, setView]
  )
  const render = useMemo(() => {
    const conversationsByPeriod = converstionsList.reduce<{
      [k in (typeof periods)[number]]: Conversation[]
    }>(
      (acc, cur) => {
        acc[getPeriod(cur.update_time)].push(cur)
        return acc
      },
      {
        '7_DAYS': [],
        '30_DAYS': [],
        OLDER: [],
      }
    )

    return periods.map((period) =>
      conversationsByPeriod[period].length ? (
        <>
          <PeriodTitle key={period}>{periodsTitles[period]}</PeriodTitle>
          {conversationsByPeriod[period].map(({ id, title, update_time }) => {
            return (
              <ConversationWrapper key={id} onClick={() => onConversationClick(id)}>
                <ChatBubbleOutlineOutlinedIcon />
                <Title variant='body1'>{title}</Title>
                <Timestamp>{getFormatedDateTime(update_time)}</Timestamp>
              </ConversationWrapper>
            )
          })}
        </>
      ) : null
    )
  }, [converstionsList, onConversationClick])
  return <ConverstionsList>{render}</ConverstionsList>
}
