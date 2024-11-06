import { styled } from '@mui/system'
import Button from '@mui/material/Button'
import { Props } from './Btn'

export const ButtonStyled = styled(Button)<Props>`
  position: relative;
  border: none;
  border-radius: 4px;
  overflow: hidden;
  height: ${(props) => (props.big ? '42px;' : '32px;')};
  background-color: ${({ theme: { palette } }) => palette.colorBgBase};

  svg {
    fill: ${({ theme: { palette } }) => palette.colorDisabled};
  }

  :hover {
    background-color: ${({ theme: { palette } }) => palette.primary.main};
    color: ${({ theme: { palette } }) => palette.primary.contrastText};
    svg {
      fill: ${({ theme: { palette } }) => palette.primary.contrastText};
    }
  }

  :active {
    background-color: ${({ theme: { palette } }) => palette.primary.contrastText};
    border-color: ${({ theme: { palette } }) => palette.primary.main};
    color: ${({ theme: { palette } }) => palette.primary.main};

    svg {
      fill: ${({ theme: { palette } }) => palette.primary.main};
    }
  }
`
