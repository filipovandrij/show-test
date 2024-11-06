import React, { useCallback, useEffect, useState } from 'react'
import { FormControl, MenuItem as MuiMenuItem, Select as MuiSelect, SelectChangeEvent, Tooltip } from '@mui/material'
import { styled } from '@mui/system'
import { automations, getKey } from './LinkAnalyzerForm'
import { Action } from '../../../chrome/findCandidatesState'
import { Bot } from '../../../components/Icons/Bot'

type Props = {
	name: string
	disabled: boolean
	handleChange: (event: SelectChangeEvent<unknown>) => Promise<void>
	actions?: Record<string, Action>
}

const Select = styled(MuiSelect)<{ border: boolean }>`
  background-color: white;
  font-family: 'Axiforma';
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.24);
  border-radius: 4px 4px 0px 0px;
  .MuiOutlinedInput-notchedOutline {
    border: ${({ border }) => border ? '1px solid #ab47bc' : 'none'}
  }

  &.Mui-disabled {
    background-color: #EBEBEB;
    color: #9e9e9e;
	border-bottom: 2px dotted #7f7f7f;

    & svg {
      fill: #9e9e9e;
    }
  }
`

const MenuItem = styled(MuiMenuItem)`
  &:hover {
    background-color: #AB47BC;
    color: white;
  }
`

const value = () => {
	return (
		<div style={{ display: 'flex', gap: 8, color: '#AB47BC', fill: '#AB47BC', alignItems: 'center' }}>
			<Bot/>
			Automations
		</div>
	)
}

const SelectAutomations = ({ name, disabled, handleChange, actions }: Props) => {
	const [open, setOpen] = useState(false)
	const [border, setBorder] = useState(false)

	const handleClose = useCallback(() => {
		setOpen(false)
	}, [])

	const handleOpen = useCallback(() => {
		setOpen(true)
	}, [])

	useEffect(() => {
		const listener = (request: any) => {
			if (request.action === 'openSelectAutomations' && request.name === name) {
				setOpen(true)
				setBorder(true)
				setTimeout(() => setBorder(false), 1000)
			}
		}

		chrome.runtime.onMessage.addListener(listener)
		return () => chrome.runtime.onMessage.removeListener(listener)
	}, [])

	return (
		<FormControl fullWidth id={`form-auto-${name}`}>
			<Select
				open={open}
				onClose={handleClose}
				onOpen={handleOpen}
				id={`select-auto-${name}`}
				value={value}
				renderValue={value}
				name={name}
				disabled={disabled}
				onChange={handleChange}
				border={border}
				MenuProps={{
					PaperProps: {
						style: {
							border: border ? '1px solid #ab47bc' : ''
						}
					},
				}}
			>
				{automations[getKey(name) as string].map(({ value, title, content }) => (
					<MenuItem value={value} disabled={!!actions?.[value]?.title}>
						<Tooltip title={title}>
							<div style={{ width: '100%' }}>{content}</div>
						</Tooltip>
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}

export default SelectAutomations