import { Button, styled, Paper as MUIPaper, FormControl } from '@mui/material'

export const Command = styled(Button)<{
  active?: boolean
}>`
  background-color: #ebebeb;
  position: relative;
  border-radius: 4px 4px 0 0;
  width: 100%;
  text-transform: none;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  color: #212121;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  gap: 8px;

  svg {
    color: #212121;
  }

  :hover {
    color: #fff;
    background-color: ${({ theme: { palette } }) => palette.primary.main};

    svg {
      color: #fff;
    }
  }

  ${({ active }) =>
    active
      ? `
      background-color: #ab47bc;
      color: #fff;
      svg {
        color: #fff;
      }
    `
      : ''}
`

export const Paper = styled(MUIPaper)`
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

export const InputsFormControls = styled(FormControl)`
  width: 94%;
  border: 2px solid #eff2f4;
  border-radius: 5px;
  padding: 6px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 3px;
`
