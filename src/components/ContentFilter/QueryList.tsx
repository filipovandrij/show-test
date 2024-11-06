import React from 'react'
import { Button as MuiButton, Tooltip, Typography } from '@mui/material'
import { styled } from '@mui/system'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 150px;
  overflow-y: auto;
  width: 100%;
`

const Button = styled(MuiButton)`
  min-width: 200px;
  height: 44px;
  padding: 12px 17px;
  gap: 8px;
  border-radius: 30px;
  color: #AB47BC;
  border-color: #AB47BC;
  text-transform: none;

  &:hover {
    border-color: #AB47BC;
  }
`

type Props = {
  queries: any
  onClick: (value: string) => void
}

const QueryList = ({ queries, onClick }: Props) => {
  return (
    <Container>
      {queries.map((query: any) =>
        <Tooltip
          title={
            <Typography variant='subtitle1' sx={{ color: 'white' }}>{query.tooltip}</Typography>
          }
        >
          <Button
            key={query.id}
            sx={{ fontSize: 'large' }}
            variant='outlined'
            onClick={() => onClick(query.value)}
          >
            {query.title}
          </Button>
        </Tooltip>
      )}
    </Container>
  )
}

export default QueryList