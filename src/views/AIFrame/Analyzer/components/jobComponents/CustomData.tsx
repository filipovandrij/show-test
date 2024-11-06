import { useEffect, useState } from 'react'
import { Box, Chip, List, ListItem, ListItemText, Typography } from '@mui/material'
import Draggable from 'react-draggable'
import styled from 'styled-components'
import HelpIcon from '@mui/icons-material/Help'
import SettingsIcon from '@mui/icons-material/Settings'
import dayjs from 'dayjs'
import WaitingIconAnimated from '../../../../../components/Icons/WaitingIconAnimated'
import Navigation from '../../../../../components/Icons/Navigation'

const WaitingIconContainer = styled.div`
  padding: 3px;
  font-size: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const CustomDataModal = () => {
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const localStorageKeyTitle = 'title-1'
  const localStorageKeyContent = 'content-1'
  const [gptMessages, setGptMessages] = useState([])

  const formattedDate = dayjs().format('DD MMM YYYY')

  useEffect(() => {
    const savedTitle = localStorage.getItem(localStorageKeyTitle)
    const savedContent = localStorage.getItem(localStorageKeyContent)
    if (savedTitle) {
      setTitle(savedTitle)
    }
    if (savedContent) {
      setContent(savedContent)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(localStorageKeyTitle, title)
    localStorage.setItem(localStorageKeyContent, content)
  }, [title, content])

  const loadMessages = () => {
    chrome.storage.local.get(['userMessages'], (result) => {
      if (result.userMessages) {
        console.log('Загруженные сообщения:', result.userMessages)
        setGptMessages(result.userMessages)
      } else {
        console.log('Сообщения не найдены.')
      }
    })
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${hours}.${minutes}.${seconds}`
  }
  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.action === 'messagesUpdated') {
        loadMessages()
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)

    return () => chrome.runtime.onMessage.removeListener(handleMessage)
  }, [])

  return (
    <div
      style={{
        height: '100%',
      }}
    >
      <Draggable handle='.drag-handle'>
        <Box
          sx={{
            background: 'white',
            color: 'black',
            width: '320px',
            height: '312px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            borderRadius: '10px',
            gap: '8px',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
            padding: '8px',
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant='body2'
              sx={{
                fontWeight: '500',
                lineHeight: '22px',
                letterSpacing: '0.15px',
                fontSize: '16px',
                width: '232px',
              }}
            >
              Automatization of the &lt;Name of service&gt; is going
            </Typography>
            <Box
              sx={{
                color: '#79828A',
                display: 'flex',
                gap: '8px',
              }}
            >
              <HelpIcon
                sx={{
                  width: '16px',
                  height: '16px',
                }}
              />
              <SettingsIcon
                sx={{
                  width: '16px',
                  height: '16px',
                }}
              />
              <Box
                className='drag-handle'
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'grab',
                }}
              >
                <Navigation />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              width: '100%',
              color: '#AB47BC',
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '4px',
              alignItems: 'center',
            }}
          >
            <WaitingIconContainer>
              <WaitingIconAnimated />
            </WaitingIconContainer>
            <Typography
              sx={{
                fontWeight: '500',
                lineHeight: '16px',
                letterSpacing: '0.5px',
                fontSize: '11px',
                width: '232px',
                color: '#79747E',
              }}
            >
              {formattedDate}
            </Typography>
          </Box>
          <Box
            sx={{
              color: 'rgb(171, 71, 188)',
              maxHeight: '300px',
              overflowY: 'auto',
              width: '100%',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#CE93D8',
                borderRadius: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#F3E9F5',
                borderRadius: '8px',
              },
              '&::-webkit-scrollbar-button': {
                display: 'none',
              },
            }}
          >
            <List
              sx={{
                color: 'black',
              }}
            >
              {gptMessages.map((item: any, index: any) => (
                <ListItem
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: index === gptMessages.length - 1 ? '4px' : '24px',
                    padding: '2px 4px',
                    backgroundColor: index === gptMessages.length - 1 ? '#F3E9F5' : 'inherit',
                  }}
                >
                  <Chip
                    sx={{
                      fontWeight: '600',
                      fontSize: '12px',
                      lineHeight: '16',
                      letterSpacing: '0.5',
                      color: index === gptMessages.length - 1 ? ' #790D8B' : '#757575',
                      margin: '4px 0',
                      backgroundColor: index === gptMessages.length - 1 ? '#CE93D8' : 'default',
                    }}
                    label={index === gptMessages.length - 1 ? 'Running' : formatTime(item.date)}
                  />

                  <ListItemText
                    sx={{
                      weight: '400',
                      fontSize: '14px',
                      lineHeight: '20',
                      letterSpacing: '0.25',
                    }}
                    primary={item.message}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Draggable>
    </div>
  )
}
