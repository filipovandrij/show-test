import { useEffect, useState } from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import CircleIcon from '@mui/icons-material/Circle'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterListIcon from '@mui/icons-material/FilterList'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import CloseIcon from '@mui/icons-material/Close'
import dayjs from 'dayjs'
import { Box, Divider, Menu, MenuItem, styled, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import { Email, StatisticUnit } from '../types'

type Props = {
  email: Email,
  onClose: () => void,
}

type Period = 'daily' | 'weekly' | 'monthly'

type Type = 'planned' | 'sent' | 'received'

const Statistics = ({ email, onClose }: Props) => {
  dayjs.extend(weekOfYear)
  dayjs.extend(isoWeek)

  const [isLegendHidden, setLegendHidden] = useState(false)
  const [period, setPeriod] = useState<Period>('daily')
  const [type, setType] = useState<Type>('sent')
  const [typeEl, setTypeEl] = useState<HTMLDivElement | null>(null)
  const [periodEl, setPeriodEl] = useState<HTMLDivElement | null>(null)
  const [date, setDate] = useState<string[]>([])
  const [firstTime, setFirstTime] = useState<number[]>([])
  const [followUp, setFollowUp] = useState<number[]>([])
  const [noLabel, setNoLabel] = useState<number[]>([])
  const [total, setTotal] = useState(0)
  const [totalFirstTime, setTotalFirstTime] = useState(0)
  const [totalFollowUp, setTotalFollowUp] = useState(0)
  const [totalNoLabel, setTotalNoLabel] = useState(0)
  const [startNumber, setStartNumber] = useState(0)
  const [reverseEmailKeys, setReverseEmailKeys] = useState<string[]>([])
  const [reverseEmailValues, setReverseEmailValues] = useState<StatisticUnit[]>([])

  useEffect(() => {
    setReverseEmailKeys(Object.keys(email[period]).reverse())
    setReverseEmailValues(Object.values(email[period]).reverse())
  }, [period, startNumber])

  useEffect(() => {
    const endNumber = startNumber + (reverseEmailValues.length / 2)
    switch(period) {
      case 'daily':
        setDate(reverseEmailKeys.map((date) => dayjs(date).format('D MMM')).slice(startNumber, endNumber))
        break
      case 'weekly':
        setDate(reverseEmailKeys.map((date) => {
          const startOfWeek = dayjs(date)
          const endOfWeek = startOfWeek.endOf('isoWeek')
          return `${startOfWeek.format('DD')}-${endOfWeek.format('DD MMM')}`
        }).slice(startNumber, endNumber))
        break
      case 'monthly':
        setDate(reverseEmailKeys.map((date) => dayjs(date).format('MMM')).slice(startNumber, endNumber))
        break
      default:
      setDate(reverseEmailKeys.map((date) => dayjs(date).format('D MMM')).slice(startNumber, endNumber))
    }
    setFirstTime(reverseEmailValues.map((item) => item.first_time || 0).slice(startNumber, endNumber))
    setFollowUp(reverseEmailValues.map((item) => item.follow_up || 0).slice(startNumber, endNumber))
    setNoLabel(reverseEmailValues.map((item) => item.no_label || 0).slice(startNumber, endNumber))
  }, [reverseEmailKeys, reverseEmailValues])

  useEffect(() => {
    const followUp = reverseEmailValues.map(x => x.follow_up || 0).reduce((prev, cur) => prev + cur, 0)
    const firstTime = reverseEmailValues.map(x => x.first_time || 0).reduce((prev, cur) => prev + cur, 0)
    const noLabel = reverseEmailValues.map(x => x.no_label || 0).reduce((prev, cur) => prev + cur, 0)
    setTotalFollowUp(followUp)
    setTotalFirstTime(firstTime)
    setTotalNoLabel(noLabel)
    setTotal(followUp + firstTime + noLabel)
  }, [reverseEmailKeys, reverseEmailValues])

  useEffect(() => {
    setStartNumber(0)
  }, [period])

  const onLegendClick = () => {
    setLegendHidden(!isLegendHidden)
  }

  const onTypeClick = (type: Type) => {
    setType(type)
    setTypeEl(null)
  }

  const onPeriodClick = (period: Period) => {
    setPeriod(period)
    setPeriodEl(null)
  }

  const onLeftClick = () => {
    const diff = reverseEmailKeys.length / 2
    setStartNumber(startNumber > 0 ? startNumber - diff : 0)
  }

  const onRightClick = () => {
    const diff = reverseEmailKeys.length / 2
    if (startNumber == 0) {
      setStartNumber(startNumber + diff)
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
    <Box sx={{ backgroundColor: '#FBFBFB', padding: '12px 8px 8px', borderRadius: '4px', width: '393px' }}>
      <Box sx={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <FilterListIcon sx={{ color: '#AB47BC', fontSize: '1rem' }}/>
        <Box sx={{ display: 'flex', gap: '4px', cursor: 'pointer' }} onClick={(e) => setTypeEl(e.currentTarget)}>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: '500',
              lineHeight: '1.5',
              fontFamily: 'Roboto',
              color: '#666666',
              textTransform: 'capitalize'
            }}
          >
            {type}
          </Typography>
          <ExpandMoreIcon sx={{ color: '#666666' }} />
        </Box>
        <Box sx={{ display: 'flex', gap: '4px', cursor: 'pointer' }} onClick={(e) => setPeriodEl(e.currentTarget)}>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: '500',
              lineHeight: '1.5',
              fontFamily: 'Roboto',
              color: '#666666',
              textTransform: 'capitalize'
            }}
          >
            {period}
          </Typography>
          <ExpandMoreIcon sx={{ color: '#666666' }} />
        </Box>
        <CloseIcon sx={{ fontSize: '1rem', color: '#757575', marginLeft: 'auto', cursor: 'pointer' }} onClick={onClose} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box sx={{ textAlign: 'center', flexBasis: '30%', margin: 'auto' }}>
          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: '500',
              lineHeight: '1.5',
              fontFamily: 'Roboto',
              color: '#212121',
            }}
          >
            { total }
          </Typography>
          <Typography
            sx={{ fontSize: '1rem', fontFamily: 'Roboto', color: '#757575', lineHeight: '1.5' }}
          >
            Total
          </Typography>
        </Box>
        <Divider orientation='vertical' variant='fullWidth' flexItem />
        <Box sx={{ textAlign: 'center', flexBasis: '30%', margin: 'auto'  }}>
          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: '500',
              lineHeight: '1.5',
              fontFamily: 'Roboto',
              color: '#212121',
            }}
          >
            { totalFirstTime }
          </Typography>
          <Typography
            sx={{ fontSize: '1rem', fontFamily: 'Roboto', color: '#757575', lineHeight: '1.5' }}
          >
            First-time
          </Typography>
        </Box>
        <Divider orientation='vertical' variant='fullWidth' flexItem />
        <Box sx={{ textAlign: 'center', flexBasis: '30%', margin: 'auto'  }}>
          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: '500',
              lineHeight: '1.5',
              fontFamily: 'Roboto',
              color: '#212121',
            }}
          >
            { totalFollowUp }
          </Typography>
          <Typography
            sx={{ fontSize: '1rem', fontFamily: 'Roboto', color: '#757575', lineHeight: '1.5' }}
          >
            Follow-up
          </Typography>
        </Box>
        <Divider orientation='vertical' variant='fullWidth' flexItem />
        <Box sx={{ textAlign: 'center', flexBasis: '30%', margin: 'auto' }}>
          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: '500',
              lineHeight: '1.5',
              fontFamily: 'Roboto',
              color: '#212121',
            }}
          >
            { totalNoLabel }
          </Typography>
          <Typography
            sx={{ fontSize: '1rem', fontFamily: 'Roboto', color: '#757575', lineHeight: '1.5' }}
          >
            No label
          </Typography>
        </Box>
      </Box>

      <BarChart
        xAxis={[{ scaleType: 'band' as const, data: date, disableTicks: true, tickLabelStyle: { fontSize: 10 } }]}
        series={[
          { data: noLabel, stack: 'A', color: '#40CABD' },
          { data: firstTime, stack: 'A', color: '#914DF3' },
          { data: followUp, stack: 'A', color: '#B586F9' },
        ]}
        grid={{ horizontal: true }}
        height={300}
        sx={{
          '& .MuiChartsAxis-line': {
            stroke: '#DDDDDD !important',
            strokeWidth: '2px !important'
          }
        }}
        yAxis={[{ disableLine: true, disableTicks: true }]}
        tooltip={{ trigger: 'none' }}
        skipAnimation
        borderRadius={2}
        slots={{
          bar: function CustomBar ({ style, className, ownerState }) {
            const [y, setY] = useState(0)
            const [x, setX] = useState(0)
            const [height, setHeight] = useState(0)
            const [width, setWidth] = useState(0)
            useEffect(()=> {
              const animationStyle = style as unknown as {
                x : {
                  animation: {
                    to: number
                  }
                },
                y : {
                  animation: {
                    to: number
                  }
                },
                height: {
                  animation: {
                    to: number
                  }
                },
                width: {
                  animation: {
                    to: number
                  }
                }
              }
              setY(animationStyle.y.animation.to)
              setX(animationStyle.x.animation.to)
              setHeight(animationStyle.height.animation.to)
              setWidth(animationStyle.width.animation.to)
            }, [style])

              return <NoMaxWidthTooltip arrow
                placement="right"
                title={
                  (ownerState.color == '#914DF3' ?
                  `${firstTime[ownerState.dataIndex]} first-time emails were sent by system ` :
                  ownerState.color == '#B586F9' ?
                  `${followUp[ownerState.dataIndex]} follow-up emails were sent by system ` :
                  `${noLabel[ownerState.dataIndex]} emails were sent by user `)
                  + date[ownerState.dataIndex]
                }>
                    <rect cursor="unset"
                    style={{
                      height,
                      width: '16px',
                      transform: `translate3d(${x+((width- 16) / 2)}px, ${y}px, 0px)`,
                      fill: `${ownerState.color}`
                    }}
                    className={ className }/>
                </NoMaxWidthTooltip>
          },
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center'  }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
          }}
          onClick={onLegendClick}
        >
          <Typography
            sx={{
              fontFamily: 'Roboto',
              fontWeight: '500',
              fontSize: '1rem',
              lineHeight: '1.5',
              color: '#666666',
            }}
          >
            Legend
          </Typography>
          {
            isLegendHidden ?
            <ExpandMoreIcon sx={{ color: '#666666' }} /> :
            <ExpandLessIcon sx={{ color: '#666666' }} />
          }
        </Box>
        <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <KeyboardArrowLeftIcon  sx={{ fontSize: '1.125rem', color: '#757575', cursor: 'pointer' }} onClick={ onLeftClick }/>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              fontSize: '0.75rem',
              color: '#757575',
            }}
          >
            { startNumber + Object.keys(email[period]).length / 2 }/{ Object.keys(email[period]).length }
          </Typography>
          <KeyboardArrowRightIcon sx={{ fontSize: '1.125rem', color: '#757575', cursor: 'pointer' }} onClick={ onRightClick }/>
        </Box>
      </Box>
      {!isLegendHidden && (
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <NoMaxWidthTooltip arrow
            title={'Emails sent by user'}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CircleIcon sx={{ color: '#40CABD', fontSize: '0.75rem' }} />
              <Typography
                sx={{ fontFamily: 'Roboto', fontSize: '1rem', lineHeight: '1.5', color: '#646464' }}
              >
                no label
              </Typography>
              </Box>
            </NoMaxWidthTooltip>
            <NoMaxWidthTooltip arrow
            title={'Initial outreach to a recipient who has not been contacted before'}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CircleIcon sx={{ color: '#914DF3', fontSize: '0.75rem' }} />
                <Typography
                  sx={{ fontFamily: 'Roboto', fontSize: '1rem', lineHeight: '1.5', color: '#646464' }}
                >
                  first-time emails
                </Typography>
              </Box>
            </NoMaxWidthTooltip>
            <NoMaxWidthTooltip arrow
            title={'Emails sent to re-engage or check in'}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CircleIcon sx={{ color: '#B586F9', fontSize: '0.75rem' }} />
              <Typography
                sx={{ fontFamily: 'Roboto', fontSize: '1rem', lineHeight: '1.5', color: '#646464' }}
              >
                follow-up emails
              </Typography>
              </Box>
            </NoMaxWidthTooltip>
          </Box>
      )}

      <Menu
        anchorEl={typeEl}
        open={Boolean(typeEl)}
        onClose={() => setTypeEl(null)}
        slotProps={{
          paper: {
            style: {
              maxHeight: '48px * 4.5',
              width: '20ch',
            },
          },
        }}
      >
        {
          (['sent', 'received', 'planned'] as Type[]).map(type =>
            <MenuItem onClick={() => onTypeClick(type)} sx={{ textTransform: 'capitalize' }}>
              {type}
            </MenuItem>
          )
        }
      </Menu>

      <Menu
        anchorEl={periodEl}
        open={Boolean(periodEl)}
        onClose={() => setPeriodEl(null)}
        slotProps={{
          paper: {
            style: {
              maxHeight: '48px * 4.5',
              width: '20ch',
            },
          },
        }}
      >
        {
          (['daily', 'weekly', 'monthly'] as Period[]).map(period =>
            <MenuItem onClick={() => onPeriodClick(period)} sx={{ textTransform: 'capitalize' }}>
              {period}
            </MenuItem>
          )
        }
      </Menu>
    </Box>
  )
}

export default Statistics
