import {
  FormControl,
  MenuItem as MuiMenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material'
import { styled } from '@mui/system'
import { Add, Info } from '@mui/icons-material'
import React, { useCallback, useState } from 'react'
import { getKey, options } from './LinkAnalyzerForm'
import { AnalyzeData } from '../../../chrome/findCandidatesState'

type Props = {
  name: string
  handleChange: (event: SelectChangeEvent<unknown>) => void
  state?: any
}

const Select = styled(MuiSelect)`
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
`

const MenuItem = styled(MuiMenuItem)`
  min-width: 350px;

  &:hover {
    background-color: #ab47bc;
    color: white;
  }
`

const value = () => {
  return (
    <div style={{ display: 'flex', gap: 8, color: '#AB47BC', alignItems: 'center' }}>
      <Add style={{ color: '#AB47BC' }} />
      Add job data
    </div>
  )
}

const SelectData = ({ name, handleChange, state }: Props) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const handleMouseEnter = useCallback((value: number) => {
    setHoveredItem(value)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null)
  }, [])

  return (
    <FormControl fullWidth id={`form-date-${name}`}>
      <Select
        labelId={`select-label-${name}`}
        id={`select-${name}`}
        name={name}
        value={value}
        renderValue={value}
        onChange={handleChange}
      >
        {options[getKey(name) as string].map(({ value, title, content }, index) => (
          <MenuItem
            value={value}
            disabled={!!state?.[value as keyof AnalyzeData]?.status}
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {hoveredItem === index && (
              <Tooltip title={title}>
                <Info style={{ marginRight: '10px' }} />
              </Tooltip>
            )}
            {content}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectData
