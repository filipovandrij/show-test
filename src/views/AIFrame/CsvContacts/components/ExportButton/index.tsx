import { Box } from '@mui/material'
import { FC, ReactNode, memo } from 'react'
import styled from '@emotion/styled'

const CommandCardContainer = styled(Box)<{
  hasError: boolean
  color: string
  backgroundColor: string
  hoverColor: string
}>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  border-radius: 4px;
  border: ${({ hasError }) => (hasError ? '1px red solid' : 'none')};
  padding: 8px;
  display: flex;
  flex-direction: column;
  transition: all 1s;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;

  .descriptionContainer {
    font-family: Axiforma;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    transition: max-height 0.1s;
    max-height: 0;
    overflow: hidden;
  }

  .MuiSwitch-track {
    background-color: #c7b1dc !important;
    opacity: 1;
    border: 0;
  }

  svg {
    color: #ab47bc;
  }

  &:hover {
    gap: 8px;
    cursor: pointer;
    background-color: ${({ hoverColor }) => hoverColor};
    color: #fff;

    .descriptionContainer {
      transition: max-height 1s 0.3s;
      max-height: 300px;
    }

    svg {
      color: #fff;
    }

    .MuiSwitch-thumb {
      color: #fff;
    }
  }
`

type CommandCardProps = {
  title: ReactNode
  backgroundColor: string
  color: string
  hoverColor: string
  onClick?: () => void
  hasError?: boolean
}

export const ExportButton: FC<CommandCardProps> = memo(
  ({ title, backgroundColor, color, hoverColor, onClick, hasError }) => {
    return (
      <CommandCardContainer
        onClick={onClick}
        hasError={!!hasError}
        backgroundColor={backgroundColor}
        color={color}
        hoverColor={hoverColor}
      >
        {title}
      </CommandCardContainer>
    )
  }
)
