import React, { ChangeEvent, useCallback, useState } from 'react'
import {
  Button,
  IconButton,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
  Slide,
  TextField,
  Tooltip,
} from '@mui/material'
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/system'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { MailOutline, ThumbDown, ThumbUp } from '@mui/icons-material'
import { Paper } from './styled'
import { loadNewTab } from '../../../utils/newTab'
import { TResult, TStatusLike } from '../../../chrome/findCandidatesState'
import { GoogleDoc } from '../../../components/Icons/GoogleDoc'
import { FilledCoin } from '../../../components/Icons/FilledCoin'

const Command = styled(Button)`
  background-color: #4caf50;
  position: relative;
  border-radius: 4px 4px 0 0;
  width: 100%;
  text-transform: none;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  gap: 8px;

  svg {
    color: #fff;
  }
  &:hover {
    background-color: #4caf50;
  }
`

const ContainerTokenRating = styled('div')`
  width: 96%;
  display: flex;
  flex-direction: column;
  background: #f3e9f5;
  border: 1px solid #c7b1dc;
  border-radius: 4px;
  padding: 8px;
  & path {
    fill: rgb(250, 175, 0);
  }
`

const ContainerToken = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
  & path {
    fill: #ab47bc;
  }
`

const LikesContainer = styled('div')`
  display: flex;
  align-items: center;
  margin: auto;
  justify-content: center;
  width: 102px;
  height: 32px;
  background: #f3e9f5;
  padding: 0px 8px 0px 8px;
  border-radius: 17px;
  gap: 6px;
  box-shadow: rgb(243, 233, 245) -5px 0px 4px 0px;
`
const FeedbackContainerTxt = styled('div')`
  margin: auto;
  font-size: 14px;
  color: #9e9e9e;
  font-weight: 400;
`

const SelectMessage = styled(MuiSelect)`
  background-color: white;
  width: 50%;

  .MuiOutlinedInput-notchedOutline {
    border: 1px solid rgb(235 235 235);
  }
}
`
const SelectItem = styled(MenuItem)`
  &:hover {
    text-decoration: none;
    background-color: rgb(171 71 188);
    color: #fff;
  }
`

const styleLike = {
  dislike: {
    backgroundColor: 'rgb(171 71 188)',
    width: '40px',
    height: '32px',
    borderRadius: '100px',
    padding: '4px 8px 4px 8px',
    '& svg': {
      color: '#fff',
    },
  },
  like: {
    backgroundColor: 'rgb(171 71 188)',
    width: '40px',
    height: '32px',
    borderRadius: '100px',
    padding: '4px 8px 4px 8px',
    '& svg': {
      color: '#fff',
    },
  },
}

const Btn = styled(Button)`
  background-color: #fff;
  position: relative;
  border-radius: 4px;
  text-transform: none;
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 5px;
  width: 50%;
  border: 1px solid rgb(235 235 235);
`
const BtnLoading = styled(Button)`
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  text-transform: none;
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 5px;
  width: 50%;
  border: 1px solid rgb(235 235 235);
  background-color: #fff;

  & span,
  & svg {
    position: relative;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #d8eaff;
    animation: fillBackground 60s linear forwards;
  }

  @keyframes fillBackground {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }
`

const Header = styled('div')`
  display: flex;
  gap: 16px;
  width: 100%;
  align-items: center;
`

const renderValue = () => {
  return (
    <div style={{ display: 'flex', gap: 8, color: '#AB47BC' }}>
      <MailOutline style={{ color: '#AB47BC' }} />
      Send a letter
    </div>
  )
}
const options = [
  { title: 'Email', value: 'email' },
  { title: 'Linkedin', value: 'linkedin' },
]

type Props = TResult & {
  propmtValue: string
  prompts: { id: string; name: string; active: boolean }[]
  usedPrompts?: Record<string, boolean>
  onChange: (i: number, elem: string, value: any) => void
  //   onClick: (i: number, elem: boolean, value: any) => void
  onChangePrompt: (event: SelectChangeEvent) => void
  index: number
  allResults: any
  handleSubmit: () => Promise<void>
}

const minLength = 200

const Result = ({
  handleSubmit,
  allResults,
  title,
  letter,
  statusLike,
  raiting,
  documentUrl,
  loading,
  // eslint-disable-next-line no-unused-vars
  prompts,
  // usedPrompts,
  onChange,
  //   onClick,

  // eslint-disable-next-line no-unused-vars
  onChangePrompt,
  index,
  propmtValue,
}: Props) => {
  const [active, setActive] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState<TStatusLike | undefined>(statusLike)
  const [text, setText] = useState(letter || '')
  const [raitingStar, setRaitingStar] = useState<number | undefined>(raiting)

  const handleChangeTextField = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { value } = e.target
      setText(value)
      onChange(index, 'letter', value)
    },
    []
  )

  const handleRatingChange = useCallback(
    (e: React.ChangeEvent<{}>, value: number | null) => {
      if (value !== null) {
        setRaitingStar(value)
        onChange(index, 'raiting', value)
      }
    },
    [index, onChange]
  )
  const [likeChoice, setLikeChoice] = useState<TStatusLike | undefined>()

  const handleButtonClick = useCallback(() => {
    setStatus((prev) => {
      const value: TStatusLike | undefined = prev === likeChoice ? undefined : likeChoice
      onChange(index, 'statusLike', likeChoice)
      return value
    })
  }, [likeChoice, onChange, index])

  const handleGoogleDoc = useCallback(async () => {
    if (!documentUrl) {
      return
    }
    await loadNewTab(documentUrl)
  }, [documentUrl])

  const selectedOptions = allResults.map((result: any) => result.title)

  return (
    <div>
      <Command onClick={() => setActive((prev) => !prev)}>
        <span style={{ marginRight: 'auto' }}>{title}</span>
        {active ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Command>
      <Slide
        direction='left'
        in={active}
        timeout={300}
        style={{ transitionDelay: '300ms' }}
        mountOnEnter
        unmountOnExit
      >
        <Paper elevation={1} square={false} style={{ backgroundColor: '#FFFFFF' }}>
          <Header>
            {loading ? (
              <>
                <Tooltip title='Here you can find all of your results'>
                  <BtnLoading style={{ color: '#2196F3' }}>
                    <GoogleDoc style={{ position: 'relative' }} />
                    <p style={{ margin: 0, position: 'relative' }}>Processing data</p>
                  </BtnLoading>
                </Tooltip>
                <SelectMessage disabled displayEmpty value='' renderValue={renderValue}>
                  {options.map((option) => (
                    <MenuItem value={option.value}>{option.title}</MenuItem>
                  ))}
                </SelectMessage>
              </>
            ) : (
              <>
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
              </>
            )}
          </Header>
          {!status && !loading && (
            <>
              <>
                <LikesContainer>
                  <IconButton
                    sx={
                      likeChoice === 'like' ? styleLike[likeChoice] : { backgroundColor: 'initial' }
                    }
                    onClick={() => setLikeChoice('like')}
                  >
                    <ThumbUp />
                  </IconButton>
                  <IconButton
                    sx={
                      likeChoice === 'dislike'
                        ? styleLike[likeChoice]
                        : { backgroundColor: 'initial' }
                    }
                    onClick={() => setLikeChoice('dislike')}
                  >
                    <ThumbDown />
                  </IconButton>
                </LikesContainer>
                {likeChoice === 'dislike' && (
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
                            color:
                              text.length === 0
                                ? '#9E9E9E'
                                : text.length < minLength
                                ? '#F44336'
                                : '#4CAF50',
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
              </>

              {likeChoice === 'like' && (
                <>
                  <ContainerTokenRating>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Stack spacing={1}>
                        <Rating
                          onChange={handleRatingChange}
                          name='half-rating'
                          defaultValue={raiting}
                          precision={0.5}
                        />
                      </Stack>
                    </div>
                  </ContainerTokenRating>

                  {Number(raitingStar) < 5 ? (
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
                  ) : null}
                  <Button
                    disabled={text.length < minLength && Number(raitingStar) !== 5}
                    onClick={handleButtonClick}
                    style={{
                      width: '100%',
                      backgroundColor:
                        text.length < minLength && Number(raitingStar) !== 5
                          ? 'rgb(196, 126, 208)'
                          : 'rgb(171, 71, 188)',
                      color: '#fff',
                    }}
                  >
                    Send feedback
                  </Button>
                </>
              )}
            </>
          )}
          {status === 'like' && raitingStar && raitingStar < 5 && (
            <FeedbackContainerTxt>Thank you for your feedback!</FeedbackContainerTxt>
          )}
          {status === 'like' && raitingStar === 5 && (
            <>
              <FeedbackContainerTxt>Thank you for your feedback!</FeedbackContainerTxt>
              <ContainerTokenRating>
                <ContainerToken>
                  <FilledCoin />
                  <p
                    style={{
                      fontFamily: 'Axiforma',
                      fontSize: '14px',
                      fontWeight: '500',
                      lineHeight: '18.2px',
                      textAlign: 'left',
                    }}
                  >
                    <span>
                      Do you want to get an additional{' '}
                      <span style={{ color: '#ab47bc' }}>20 tokens for free?</span> <br /> Please
                      rate it in
                    </span>{' '}
                    <span
                      style={{ color: '#ab47bc', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      chrome store
                    </span>
                  </p>
                </ContainerToken>
              </ContainerTokenRating>
            </>
          )}
          {status === 'dislike' && (
            <>
              <FeedbackContainerTxt>Thank you for your feedback!</FeedbackContainerTxt>
              <MuiSelect
                displayEmpty
                value={propmtValue}
                fullWidth
                placeholder='Chose alternative prompt'
                // renderValue={() => 'Chose alternative prompt'}
              >
                {['Result A', 'Result B', 'Result C'].map((option, index) => (
                  <SelectItem
                    key={index}
                    value={option}
                    disabled={selectedOptions.includes(option)}
                    onClick={handleSubmit}
                    style={{ backgroundColor: propmtValue === option ? '#AB47BC' : '' }}
                  >
                    {selectedOptions.includes(option) ? `${option} (already used)` : option}
                  </SelectItem>
                ))}
              </MuiSelect>
            </>
          )}
        </Paper>
      </Slide>
    </div>
  )
}

export default Result
