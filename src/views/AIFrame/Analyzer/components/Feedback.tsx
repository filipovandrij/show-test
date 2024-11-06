import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material'
import { MailOutline, ThumbDown, ThumbUp } from '@mui/icons-material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { GoogleDoc } from '../../../../components/Icons/GoogleDoc'
import { loadNewTab } from '../../../../utils/newTab'
import { analisys, updateAnalyze } from '../Requests/analisys'
import {
  Btn,
  BtnLoading,
  Command,
  ContainerTokenRating,
  FeedbackContainerTxt,
  Header,
  LikesContainer,
  SelectItem,
  SelectMessage,
  commonStyle,
} from '../styles/feedbackStyles'

type Props = {
  item: any
  feedback: any
  caseId: number
}
const options = [
  { title: 'Email', value: 'email' },
  { title: 'Linkedin', value: 'linkedin' },
]
const optionsSelect = ['Version A', 'Version B', 'Version C']

const renderValue = () => {
  return (
    <div style={{ display: 'flex', gap: 8, color: '#AB47BC' }}>
      <MailOutline style={{ color: '#AB47BC' }} />
      Send a letter
    </div>
  )
}

export const Feedback = ({ caseId, feedback, item }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const [propmtValue, setPropmtValue] = useState(null)

  const minLength = 200

  const [text, setText] = useState(item.letter || '')
  const [animationDuration, setAnimationDuration] = useState(0)
  const updateChages = () => {
    chrome.runtime.sendMessage({ type: 'UPDATE_DATA' })
  }
  const handleGoogleDoc = useCallback(async () => {
    if (!item.document_url) {
      return
    }
    await loadNewTab(item.document_url)
  }, [item.document_url])

  useEffect(() => {
    const start_date = item.start_date
    const now = Date.now()
    const timeDiff = (now - start_date) / 1000
    if (timeDiff > 90) {
      setIsReady(true)
    } else {
      const remainingTime = 90 - timeDiff
      setAnimationDuration(remainingTime)
      setIsReady(false)
      const timer = setTimeout(() => {
        setIsReady(true)
      }, (90 - timeDiff) * 1000)
      return () => clearTimeout(timer)
    }
  }, [item])

  const handleRatingChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: number | null
  ) => {
    if (newValue !== null) {
      updateAnalyze(item.id, { rating: newValue })
      updateChages()
    }
  }

  const handleChangeTextField = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { value } = e.target

      setText(value)
    },
    []
  )

  const handleButtonClick = () => {
    updateAnalyze(item.id, { letter: text })
    updateChages()
  }
  const handleChange = (event: any) => {
    setPropmtValue(event.target.value)
  }
  const toggleOpen = () => setIsOpen(!isOpen)

  const isOptionDisabled = (index: any) => feedback[index]
  return (
    <>
      <Command onClick={toggleOpen}>
        Version {item.title}
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Command>

      {isOpen &&
        (isReady ? (
          <>
            <Header>
              <Tooltip title='Here you can find all of your results'>
                <Btn style={{ color: '#2196F3' }} onClick={handleGoogleDoc}>
                  <GoogleDoc />
                  Analysis is ready
                </Btn>
              </Tooltip>
              <SelectMessage displayEmpty value='' renderValue={renderValue}>
                {options.map((option) => (
                  <MenuItem value={option.value}>{option.title}</MenuItem>
                ))}
              </SelectMessage>
            </Header>

            {item.rating === null && !item.letter && (
              <LikesContainer>
                <IconButton
                  sx={item.like === true ? commonStyle : { backgroundColor: 'initial' }}
                  onClick={() => {
                    updateAnalyze(item.id, { like: true })
                    updateChages()
                  }}
                >
                  <ThumbUp />
                </IconButton>
                <IconButton
                  sx={item.like === false ? commonStyle : { backgroundColor: 'initial' }}
                  onClick={() => {
                    updateAnalyze(item.id, { like: false })
                    updateChages()
                  }}
                >
                  <ThumbDown />
                </IconButton>
              </LikesContainer>
            )}

            {item.like && (
              <ContainerTokenRating>
                <p
                  style={{
                    fontFamily: 'Axiforma',
                    fontSize: '14px',
                    fontWeight: '500',
                    lineHeight: '18.2px',
                    textAlign: 'left',

                    margin: '6px',
                  }}
                >
                  <span>
                    Do you want to get an additional
                    <span style={{ color: '#ab47bc' }}> 20 tokens for free?</span>
                    <br />
                  </span>
                  {item.rating === 5 && (
                    <>
                      <span>Please rate it in </span>
                      <span
                        style={{ color: '#ab47bc', textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        chrome store
                      </span>
                    </>
                  )}
                </p>
                {item.rating < 5 && (
                  <Stack spacing={1}>
                    <Rating
                      onChange={handleRatingChange}
                      name='half-rating'
                      value={item.rating}
                      precision={0.5}
                    />
                  </Stack>
                )}
              </ContainerTokenRating>
            )}

            {!item.like && !item.letter && item.like !== null && (
              <>
                <TextField
                  size='small'
                  sx={{
                    '& .css-1uwl1xw': {
                      padding: '8.5px 14px 20px 14px',
                    },
                  }}
                  multiline
                  rows={4}
                  fullWidth
                  value={text}
                  onChange={handleChangeTextField}
                  helperText={
                    <span
                      style={{
                        color: text.length < minLength ? '#F44336' : '#4CAF50',
                        position: 'absolute',
                        right: 6,
                        bottom: 7,
                      }}
                    >
                      {text.length} / {minLength}
                    </span>
                  }
                  placeholder='You have up to 3 tries. To get access to the remaining tries, please write why you do not like the result. This is a mandatory step and it is important for us to improve our service.'
                />
                <Button
                  disabled={text.length < minLength}
                  onClick={handleButtonClick}
                  style={{
                    width: '100%',
                    backgroundColor:
                      text.length < minLength ? 'rgb(196, 126, 208)' : 'rgb(171, 71, 188)',
                    color: '#fff',
                  }}
                >
                  Send feedback
                </Button>
              </>
            )}

            {item.letter !== null && (
              <>
                <FeedbackContainerTxt>Thank you for your feedback!</FeedbackContainerTxt>
                {feedback.length !== 3 && (
                  <FormControl variant='standard'>
                    <InputLabel id='demo-simple-select-helper-label'>
                      Choose alternative prompt
                    </InputLabel>
                    <Select
                      id='demo-simple-select-helper-label'
                      value={propmtValue}
                      onChange={handleChange}
                      label='Choose alternative prompt'
                      sx={{
                        '&:focus': {
                          backgroundColor: 'none',
                        },
                      }}
                    >
                      {optionsSelect.map((option, index) => (
                        <SelectItem
                          key={index}
                          value={option}
                          disabled={isOptionDisabled(index)}
                          onClick={() => {
                            analisys(caseId)
                            updateChages()
                          }}
                          sx={{
                            fontFamily: 'Axiforma',
                            fontSize: '14px',
                            fontWeight: '500',
                            backgroundColor: propmtValue === option ? '#AB47BC' : 'transparent',
                            '&:hover': {
                              backgroundColor: '#AB47BC',
                              color: 'white',
                            },
                          }}
                        >
                          {isOptionDisabled(index) ? `${option} (already used)` : option}
                        </SelectItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </>
            )}
          </>
        ) : (
          <Header>
            <Tooltip title='Here you can find all of your results'>
              <BtnLoading animationDuration={animationDuration} style={{ color: '#2196F3' }}>
                <GoogleDoc style={{ position: 'relative' }} />
                <p style={{ margin: 0, position: 'relative' }}>Processing data</p>
              </BtnLoading>
            </Tooltip>
            <SelectMessage disabled displayEmpty value='' renderValue={renderValue}>
              {options.map((option) => (
                <MenuItem value={option.value}>{option.title}</MenuItem>
              ))}
            </SelectMessage>
          </Header>
        ))}
    </>
  )
}
