import styled from 'styled-components'
import { Button, MenuItem, Select } from '@mui/material'

interface BtnLoadingProps {
  animationDuration: number
}

export const Command = styled(Button)`
  background-color: #4caf50;
  position: relative;
  border-radius: 4px 4px 0 0;
  width: 100%;
  text-transform: none;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  gap: 8px;

  svg {
    color: #fff;
  }
  &:hover {
    background-color: #4caf50;
  }
`

export const FeedbackContainerTxt = styled('div')`
  margin: auto;
  font-size: 14px;
  color: #9e9e9e;
  font-weight: 400;
`

export const BtnLoading = styled(Button)<BtnLoadingProps>`
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  text-transform: none;
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 5px;
  width: 50%;
  border: 1px solid rgb(235 235 235);
  background-color: #fff;

  & span,
  & svg {
    position: relative;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #d8eaff;
    animation: ${({ animationDuration }) => `fillBackground ${animationDuration}s linear forwards`};
  }

  @keyframes fillBackground {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }
`
export const Btn = styled(Button)`
  background-color: #fff;
  position: relative;
  border-radius: 4px;
  text-transform: none;
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 5px;
  width: 50%;
  border: 1px solid rgb(235 235 235);
`

export const Header = styled('div')`
  display: flex;
  gap: 16px;
  width: 100%;
  align-items: center;
`

export const SelectMessage = styled(Select)`
  background-color: white;
  width: 50%;

  .MuiOutlinedInput-notchedOutline {
    border: 1px solid rgb(235 235 235);
  }
}
`

export const LikesContainer = styled('div')`
  display: flex;
  align-items: center;
  margin: auto;
  justify-content: center;
  width: 102px;
  height: 32px;
  background: #f3e9f5;
  padding: 0px 8px 0px 8px;
  border-radius: 17px;
  gap: 6px;
  box-shadow: rgb(243, 233, 245) -5px 0px 4px 0px;
`

export const commonStyle = {
  backgroundColor: 'rgb(171 71 188)',
  width: '40px',
  height: '32px',
  borderRadius: '100px',
  padding: '4px 8px 4px 8px',
  '& svg': {
    color: '#fff',
  },
}

export const ContainerTokenRating = styled('div')`
  width: 96%;
  display: flex;
  flex-direction: column;
  background: #f3e9f5;
  border: 1px solid #c7b1dc;
  border-radius: 4px;
  padding: 8px;
  & path {
    fill: rgb(250, 175, 0);
  }
`

export const SelectItem = styled(MenuItem)`
  &:hover {
    text-decoration: none;
    background-color: rgb(171 71 188);
    color: #fff;
  }
`
