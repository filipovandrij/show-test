import { MenuItem, Select, styled } from '@mui/material'

export const JobSelect = styled(Select)`
  background-color: white;
  font-family: 'Axiforma';
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px 4px 0px 0px;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.24);

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  .MuiSelect-select[aria-expanded='true'] {
    border-bottom: 2px solid #ab47bc;
    border-radius: 4px 4px 0px 0px;
  }

  .MuiSelect-select {
    padding: 8px 14px;
  }
`

export const MenuItemJobSelect = styled(MenuItem)`
  min-width: 350px;

  &:hover {
    background-color: #ab47bc;
    color: white;
  }
`

export const Spin = styled('div')`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin 4s linear infinite;
  width: 56px;
  height: 56px;
`
