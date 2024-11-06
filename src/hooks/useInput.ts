import { SelectChangeEvent } from '@mui/material'
import { ChangeEvent, useState } from 'react'

export type useInputHook<T> = {
  value: T
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => void
}

export const useInput = (initialState: string) => {
  const [value, setValue] = useState(initialState)

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    setValue(e.target.value)
  }

  return {
    value,
    onChange,
    setValue,
  }
}
