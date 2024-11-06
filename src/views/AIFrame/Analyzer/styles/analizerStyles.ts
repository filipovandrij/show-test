import { styled } from '@mui/system'
import { Button } from '@mui/material'

export const Command = styled(Button)`
  background-color: rgb(236, 236, 236);
  position: relative;
  border-radius: 4px;
  width: 100%;
  text-transform: none;
  color: #212121;
  display: flex;
  justify-content: flex-start;
  gap: 5px;
  padding: 0 8px;
  min-height: 48px;
  box-shadow: rgb(134, 134, 134) 0px 0px 2px 0px;
  transition: all 1s ease 0s;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;

  svg {
    color: #757575;
  }

  & .date {
    font-size: 13px;
    font-weight: 400;
  }

  :hover {
    color: rgb(255, 255, 255);

    background-color: rgb(121, 14, 139);

    svg {
      color: rgb(255, 255, 255);
    }
  }
`

export const AddCommand = styled(Button)`
  background-color: #f3e9f5;
  position: relative;
  border-radius: 4px;
  width: 100%;
  text-transform: none;
  color: #ab47bc;
  display: flex;
  justify-content: flex-start;
  gap: 5px;
  padding: 0 8px;
  min-height: 48px;
  box-shadow: rgb(134, 134, 134) 0px 0px 2px 0px;
  transition: all 1s ease 0s;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;

  svg {
    color: #ab47bc;
  }

  & .date {
    font-size: 13px;
    font-weight: 400;
  }

  :hover {
    color: rgb(255, 255, 255);

    background-color: rgb(121, 14, 139);

    svg {
      color: rgb(255, 255, 255);
    }
  }
`

export const Content = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 15px 14px;
`

export const Title = styled('div')`
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px ${({ theme: { palette } }) => palette.colorBorder} solid;
  background-color: ${({ theme: { palette } }) => palette.colorBgContainer};
  padding: 10px;
  gap: 12px;
  color: #bdbdbd;
  align-items: center;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`

export const BackBtn = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  background-color: #ebebeb;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    cursor: pointer;
    background-color: #ab47bc;
    color: #fff;

    svg {
      color: #fff;
    }
  }
`

export const Child = styled('span')`
  color: #212121;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 138%;
`

export const Parent = styled('span')`
  color: #9e9e9e;
  font-family: Axiforma;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`

export const EditViewContent = styled('div')`
  border: 1px solid black;
  border-radius: 10px;
  background-color: white;
  padding: 10px;
  text-align: justify;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 500px;
`

export const FullScreenContainer = styled('div')`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); // Полупрозрачный фон
  z-index: 1000; // Высокий z-index, чтобы быть над другим содержимым
`
