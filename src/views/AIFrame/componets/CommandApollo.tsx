import Button from '@mui/material/Button'
import { styled } from '@mui/system'
import { FC, useCallback, useState } from 'react'
import { Slider, Typography } from '@mui/material'

const step = 0.5
const minDelay = 0
const maxDelay = 10
const minDistance = 0.5

const Container = styled('div')`
  display: flex;
  flex-direction: row;
  border: 1px ${({ theme: { palette } }) => palette.colorBorder} solid;
  margin-top: 8px;
  justify-content: space-between;
  align-items: center;
`

type Props = {
  count: number
  lastCount: number
  lastUniqueCount: number
  entity: string
  collectApollo: (delay: number[]) => Promise<void>
  isRunning: boolean
  copyAll: () => Promise<void>
  copyCurrent: () => void
  reset: () => Promise<void>
  stopParse: () => Promise<void>
}

const CommandApollo: FC<Props> = ({
                                    entity,
                                    count,
                                    lastCount,
                                    lastUniqueCount,
                                    collectApollo,
                                    isRunning,
                                    copyAll,
                                    copyCurrent,
                                    reset,
                                    stopParse,
                                  }) => {
  const [delay, setDelay] = useState([1, 1.5])

  const handleChangeDelay = useCallback((
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return
    }

    activeThumb === 0 ?
      setDelay([Math.min(newValue[0], delay[1] - minDistance), delay[1]])
      :
      setDelay([delay[0], Math.max(newValue[1], delay[0] + minDistance)])
  }, [delay])

  if (isRunning) {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            Count {entity}: {count}
          </div>
          <div>
            Last count {entity}: {lastCount}
          </div>

          <div>
            <div>
              Last unique count {entity}: {lastUniqueCount}
            </div>
            <div>
              Added {entity}: {lastUniqueCount}
            </div>
          </div>
        </div>
        <Button onClick={stopParse} variant='outlined'>
          stop {entity}
        </Button>
      </div>
    )
  }

  return (
    <>
      <div>Parsing apollo {entity}</div>
      <Container>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            Number of all {entity}: {count}
          </div>
          <div>
            Last count {entity}: {lastCount}
          </div>

          <div>
            <div>
              Last unique count {entity}: {lastUniqueCount}
            </div>
            <div>
              Added {entity}: {lastUniqueCount}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom>Delay</Typography>
          <Slider
            min={minDelay}
            max={maxDelay}
            step={step}
            value={delay}
            onChange={handleChangeDelay}
            valueLabelDisplay="auto"
          />
          <Button variant='outlined' onClick={() => collectApollo(delay)} disabled={isRunning}>
            {isRunning ? 'Loading...' : `parse ${entity}`}
          </Button>
          <Button variant='outlined' onClick={copyAll}>
            copy all {entity}
          </Button>
          <Button variant='outlined' onClick={copyCurrent}>
            copy current {entity}
          </Button>
          <Button variant='outlined' onClick={reset}>
            reset {entity}
          </Button>
        </div>
      </Container>
    </>
  )
}

export default CommandApollo
