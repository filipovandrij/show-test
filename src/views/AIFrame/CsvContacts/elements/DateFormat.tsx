import React from 'react'
import { styled } from '@mui/system'

const DateDiv = styled('div')`
  fontfamily: 'Axiforma';
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  color: #bdbdbd;
`

type DateFomatProps = {
  date: Date
}
export const DateFomat = ({ date }: DateFomatProps) => {
  return (
    <div style={{ marginRight: 8 }}>
      <DateDiv>
        {date.getDate().toString().padStart(2, '0')}/
        {(date.getMonth() + 1).toString().padStart(2, '0')}/
        {(date.getFullYear() - 2000).toString().padStart(2, '0')}
      </DateDiv>
      <DateDiv>
        {date.getHours().toString().padStart(2, '0')}:
        {date.getMinutes().toString().padStart(2, '0')}
      </DateDiv>
    </div>
  )
}
