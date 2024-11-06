import React, { MutableRefObject, createElement } from 'react'
import { Grid, Tooltip, Typography } from '@mui/material'
import { Box, styled } from '@mui/system'
import { AccessTime, Warning, Email } from '@mui/icons-material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import OfflinePinIcon from '@mui/icons-material/OfflinePin'
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn'
import DeviceHubIcon from '@mui/icons-material/DeviceHub'
import ErrorIcon from '@mui/icons-material/Error'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { Tag, Tags, Title } from './style'
import { TEntity, TStatus } from './model'

const Statistic = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #212121;
  font-family: Axiforma;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`

const PlannedText = styled('div')`
  margin-top: 10px;
  font-family: Axiforma;
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  text-align: left;
  color: #9e9e9e;
`

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 400 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#2196F3' : '#308fe8',
  },
}))

type Props = {
  count_processed: number
  total: number
  count_updated_individual: number
  newContacts: number
  conflicts: number
  count_errors: number
  status: TStatus
  execution_time: number
  id: number
  timeout: MutableRefObject<NodeJS.Timeout | undefined>
  polling: (id: number) => Promise<void>
  guid: string
  importNumber: number
  source: string
  entity: TEntity
  count_created_individual: number
  count_updated_company: number
  count_created_company: number
  count_duplicate_individual: number
  count_duplicate_company: number
  formattedDate: string
  tags?: string[]
  validate: boolean
}

type TooltipProps = {
  tooltipTitle: string
  tooltipDescription?: string
}

const InfoContent = ({
  count_processed,
  total,
  count_duplicate_individual,
  count_duplicate_company,
  conflicts,
  count_errors,
  count_updated_individual,
  status,
  execution_time,
  count_created_individual,
  count_updated_company,
  count_created_company,
  formattedDate,
  tags = [],
  validate = false,
}: Props) => {
  const progress = ~~((count_processed / total) * 100)

  const duplicates = count_duplicate_individual + count_duplicate_company
  const enriched = count_updated_individual + count_updated_company
  const newCreateds = count_created_individual + count_created_company
  const extracted = duplicates + enriched + newCreateds
  const extractedIndividual =
    count_duplicate_individual + count_updated_individual + count_created_individual
  const extractedCompany = count_duplicate_company + count_updated_company + count_created_company

  function formatTime(seconds: number): string {
    const totalSeconds = Math.floor(seconds)

    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60

    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
  }
  const CustomTooltipContent = ({ tooltipTitle, tooltipDescription }: TooltipProps) => (
    <>
      <Typography color='inherit'>{tooltipTitle}</Typography>
      {tooltipDescription?.split('\r\n').map((line) => (
        <Typography variant='body2' style={{ color: 'lightgray' }}>
          {line}
        </Typography>
      ))}
    </>
  )

  function renderTitle(status: any, progress: any) {
    switch (status) {
      case 'planned':
        return 'Importing prospects into AIDE'
      case 'done':
        return (
          <>
            <span>Importing prospects into AIDE </span>
            <span style={{ color: '#4CAF50' }}>Done</span>
          </>
        )
      case 'processing':
        return (
          <Title
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              paddingBottom: '6px',
            }}
          >
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span>Importing prospects into AIDE </span>
              <span style={{ color: '#2196F3' }}>{progress}%</span>
            </Box>
            <Box sx={{ width: '100%', marginTop: '4px' }}>
              <BorderLinearProgress variant='determinate' value={progress} />
            </Box>
            <PlannedText>
              {count_processed}/{total}
            </PlannedText>
          </Title>
        )
      case 'paused due to error':
        return 'Importing prospects into AIDE'
      default:
        return null
    }
  }

  function renderValidation(status: any, progress: any) {
    if (!validate) return null

    switch (status) {
      case 'processing':
        return (
          <div>
            <Typography
              variant='body1'
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'Axiforma',
                fontSize: '16px',
                fontWeight: '700',
              }}
            >
              <ErrorOutlineIcon sx={{ marginRight: '4px' }} />
              Email validation
            </Typography>
            <Title
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 10,
                boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.24)',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    color: '#AB47BC',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 4,
                  }}
                >
                  <Email color='primary' />
                  ZeroBounce email validation
                </span>
                <span style={{ color: '#AB47BC' }}>{progress}%</span>
              </Box>
              <Box sx={{ width: '100%', marginTop: '4px' }}>
                <BorderLinearProgress variant='determinate' value={progress} color='primary' />
              </Box>
              <PlannedText>
                {count_processed}/{total}
              </PlannedText>
            </Title>
          </div>
        )
      default:
        return null
    }
  }

  const dataMapping = [
    ...(status !== 'in progress'
      ? [
          {
            icon: OfflinePinIcon,
            color: 'success',
            text: `${count_processed} Scanned`,
            tooltipTitle: 'Records scanned',
            tooltipDescription:
              'All records that were scanned and sent to backend. 1 record may contain multiple data entries.',
          },
        ]
      : []),

    {
      icon: DeviceHubIcon,
      htmlColor: '#2196F3',
      text: `${enriched} Enriched`,
      tooltipTitle: 'Contacts enriched',
      tooltipDescription: `Imported data entries were used to enrich existing contacts.
      \r\nContacts (${count_updated_individual})
      \r\nOrganizations (${count_updated_company})`,
    },
    {
      icon: DoNotDisturbOnIcon,
      htmlColor: '#AB47BC',
      text: `${extracted} Extracted`,
      tooltipTitle: 'Extraction',
      tooltipDescription: `Total Entities extracted from records scanned.
      \r\nContacts (${extractedIndividual})
      \r\nOrganizations (${extractedCompany})`,
    },
    ...(status !== 'in progress'
      ? [
          {
            icon: AccessTime,
            htmlColor: '#AB47BC',
            text: formatTime(execution_time),
            tooltipTitle: 'Absolute time spent for the operation.',
            tooltipDescription:
              'Date & Time started: 21.02.23 11.20.31 Date & Time ended: 21.02.23 11.40.55',
          },
        ]
      : []),

    {
      icon: AddCircleIcon,
      htmlColor: '#4CAF50',
      text: `${newCreateds} New`,
      tooltipTitle: 'New Entities',
      tooltipDescription: `Imported entries that created new database contacts (${count_created_individual}) and/or organizations (${count_created_company}).`,
    },
    {
      icon: ErrorIcon,
      htmlColor: '#FBC319',
      text: `${conflicts} Conflicts`,
      tooltipTitle: 'Conflicts Imported',
      tooltipDescription:
        'Imported entries cause a conflict that needs to be resolved by user or AI to ensure data consistency is preserved and no duplicate entries exist.',
    },
    {
      icon: ControlPointDuplicateIcon,
      htmlColor: '#2196F3',
      text: `${duplicates} Duplicates`,
      tooltipTitle: 'Duplicates skipped',
      tooltipDescription: `Imported entries that were registered as duplicates and skipped during processing.
        \r\nContacts (${count_duplicate_individual})
        \r\nOrganizations (${count_duplicate_company})`,
    },
    {
      icon: Warning,
      htmlColor: '#F44336',
      text: `${count_errors} errors`,
      tooltipTitle: 'Errors',
      tooltipDescription: 'The number of errors encountered during the import process.',
    },
  ]

  const renderGridItems = dataMapping.map((item, index) => (
    <Grid item xs={6} key={index}>
      <Tooltip
        arrow
        followCursor
        title={
          <CustomTooltipContent
            tooltipTitle={item.tooltipTitle}
            tooltipDescription={item.tooltipDescription}
          />
        }
      >
        <Statistic>
          {createElement(item.icon, { style: { color: item.htmlColor || item.color } })}
          <span>{item.text}</span>
        </Statistic>
      </Tooltip>
    </Grid>
  ))
  return (
    <>
      <Title
        style={{
          display: status === 'done' ? 'flex' : 'block',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E0E0E0',
          paddingBottom: '6px',
        }}
      >
        {renderTitle(status, progress)}
      </Title>
      {status === 'done' && validate && (
        <span
          style={{
            display: 'flex',
            color: '#AB47BC',
            alignItems: 'center',
            gap: 4,
            marginTop: 4,
            justifyContent: 'space-between',
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'end', gap: 8, fontSize: 16, fontWeight: 600 }}
          >
            <Email color='primary' />
            ZeroBounce email validation
          </div>
          <div>
            <PlannedText>
              {count_processed}/{total}
            </PlannedText>
          </div>
        </span>
      )}
      {tags.length > 0 && (
        <Tags>
          {tags.map((t) => (
            <Tag>{t}</Tag>
          ))}
        </Tags>
      )}
      {status === 'planned' ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            color: '#9e9e9e',
          }}
        >
          <Title>Start at {formattedDate}</Title>
          <PlannedText>{total} contacts selected</PlannedText>
          <Box
            sx={{
              marginTop: '10px',
              display: 'flex',
              gap: '10px',
            }}
          >
            <FileCopyIcon color='disabled' />
            <OpenInNewIcon color='disabled' />
          </Box>
        </Box>
      ) : (
        <Grid container spacing={1}>
          {renderGridItems}
        </Grid>
      )}
      {validate && renderValidation(status, progress)}
    </>
  )
}

export default InfoContent
