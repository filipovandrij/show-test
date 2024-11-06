import { Box } from '@mui/material'
import { FC, ReactNode, memo, useState } from 'react'
import styled from '@emotion/styled'

const DescriptionContainer = styled(Box)``

const CommandCardContainer = styled(Box)<{
  disabled: boolean
  loading: boolean
  hasError: boolean
  isExpanded: boolean
}>`
  background-color: #ececec;
  border-radius: 4px;
  border: ${({ hasError }) => (hasError ? '1px red solid' : 'none')};
  padding: 8px;
  display: flex;
  flex-direction: column;
  transition: all 1s;
  color: ${({ disabled }) => (disabled ? '#757575' : '#212121')};
  opacity: ${({ loading }) => (loading ? 0.5 : 1)};
  pointer-events: ${({ disabled, loading }) => (disabled || loading ? 'none' : 'all')};
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  box-shadow: 0px 0px 2px 0px #868686;

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
    color: #757575;
  }

  &:hover {
    gap: 8px;
    cursor: pointer;
    background-color: #790e8b;
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
  description: ReactNode
  disabled?: boolean
  onClick?: () => void
  loading?: boolean
  hasError?: boolean
}

export const CommandCard: FC<CommandCardProps> = memo(
  ({ description, title, disabled, onClick, loading, hasError }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const [firstClickDone, setFirstClickDone] = useState<boolean>(false)
    const handleClick = () => {
      if (!firstClickDone) {
        setIsExpanded(true)
        setFirstClickDone(true)
      } else {
        if (onClick) {
          onClick()
        }
        setIsExpanded(false)
        setFirstClickDone(false)
      }
    }

    return (
      <CommandCardContainer
        disabled={!!disabled}
        onClick={handleClick}
        loading={!!loading}
        hasError={!!hasError}
        isExpanded={isExpanded}
      >
        {title}
        {isExpanded ? (
          <DescriptionContainer className='descriptionContainer'>
            {description}
          </DescriptionContainer>
        ) : null}
      </CommandCardContainer>
    )
  }
)
