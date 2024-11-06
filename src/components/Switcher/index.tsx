import { styled } from '@mui/system'
import { CircularProgress, Switch as MuiSwitch, SwitchProps as MuiSwitchProps } from '@mui/material'
import { transientOptions } from '../../utils/transientOptions'

const CircleStyled = styled('div', transientOptions)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${({ theme: { spacing } }) => spacing(1.75)};
  height: ${({ theme: { spacing } }) => spacing(1.75)};
  border-radius: 50%;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  background-color: white;
`

const CircularProgressStyled = styled(CircularProgress, transientOptions)`
  ${({ theme: { palette } }) => `
   color: ${palette.primary.main}};
 `}
`

export const SwitchStyled = styled(MuiSwitch)`
  width: ${({ theme: { spacing } }) => spacing(3.75)};
  height: ${({ theme: { spacing } }) => spacing(2.25)};
  padding: 0;

  & .MuiSwitch-switchBase {
    padding: 0;
    margin: 2px;

    &.Mui-checked {
      transform: translateX(12px);
      color: #fff;

      & + .MuiSwitch-track {
        background-color: ${({ theme: { palette } }) => palette.primary.main};
        opacity: 1;
        border: 0;
      }

      &.Mui-disabled + .MuiSwitch-track {
        opacity: 0.5;
      }
    }

    &.Mui-focusVisible .MuiSwitch-thumb {
      color: ${({ theme: { palette } }) => palette.primary.main};
      border: 6px solid #fff;
    }

    &.Mui-disabled .MuiSwitch-thumb {
      color: grey;
    }

    &.Mui-disabled + .MuiSwitch-track {
      opacity: 0.7;
    }
  }

  & .MuiSwitch-thumb {
    box-sizing: border-box;
    box-shadow: none;
    width: ${({ theme: { spacing } }) => spacing(1.75)};
    height: ${({ theme: { spacing } }) => spacing(1.75)};
  }

  & .MuiSwitch-track {
    border-radius: ${({ theme: { spacing } }) => spacing(1.75)};
    background-color: grey;
    opacity: 1;
  }
`

export interface SwitchProps extends MuiSwitchProps {
  loading?: boolean
}
const Circle: React.FC<{ checked: boolean; loading: boolean }> = ({ checked, loading }) => (
  <CircleStyled data-testid='circle' $active={!!(checked && !loading)}>
    {loading && <CircularProgressStyled size={14} thickness={6} />}
  </CircleStyled>
)
export const Switch: React.FC<SwitchProps> = ({ loading, disabled, checked, sx: _, ...other }) => {
  return (
    <SwitchStyled
      data-testid='switch'
      checkedIcon={<Circle checked={!!checked} loading={!!loading} />}
      icon={<Circle checked={!!checked} loading={!!loading} />}
      checked={loading ? !checked : checked}
      disabled={disabled}
      {...other}
    />
  )
}
