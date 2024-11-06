import { styled } from '@mui/system'
import { Paper as MUIPaper } from '@mui/material'

export const Paper = styled(MUIPaper)`
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  background-color: #fff;
  border-radius: 0 0 4px 4px;

  svg {
    color: #757575;
    cursor: pointer;

    &:hover {
      color: #ab47bc;
    }
  }

  input {
    padding: 10px;
    border: none;
    outline: none;

    &:hover {
      border: none;
    }
  }

  label {
    padding: 10px;
  }
`
