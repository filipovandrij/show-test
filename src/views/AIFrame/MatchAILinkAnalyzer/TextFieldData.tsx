import React, { useState } from 'react'
import { TextField } from '@mui/material'
// import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { TextFieldProps } from '@mui/material/TextField/TextField'
import { styled } from '@mui/system'
import Status from './Status'

type Props = TextFieldProps & {
  name: string
  elem: string
  value?: string
  overlay?: boolean
  status?: 'error' | 'added' | 'processing' | 'success' | 'edit' | 'visible'
  handleEditFrame: (name: string, elem: string) => void
  changeEdit: (name: string, elem: string) => void
  handleDelete: (name: string, elem: string) => void
}

const ValueContainer = styled('div')`
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 10px;
  width: 100%;
  height: 24px;
  color: #000;
  font-size: 16px;

  &:hover {
    // background-color: #bdbdbd;
    // color: #757575;
  }
`

const TextFieldData = ({
  name,
  elem,
  status,
  value,
  overlay,
  handleDelete,
  handleEditFrame,
  changeEdit,
  ...props
}: Props) => {
  const [hover, setHover] = useState(false)
  const [focused, setFocused] = useState(false)

  if (!status) {
    return null
  }

  const handleInputClick = () => {
    if (overlay) {
      handleEditFrame(name, elem)
    } else {
      changeEdit(name, elem)
    }
	setFocused(false)
  }

  const borderBottomStyle =
  status === 'error'
	? '2px solid #F44336'
	: status === 'added'
	? '1px solid rgb(33 150 243)'
	: status === 'success'
	? '2px solid #4CAF50'
	: focused
	? '2px solid rgb(171 71 188)'
	: '2px solid #9E9E9E'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        gap: 10,
        backgroundColor: '#fbf8fb',
        borderBottom: borderBottomStyle,
        borderRadius: '4px 4px 0px 0px',
        height: '55px',
      }}
    >
      {(status !== 'visible' && status !== 'edit') || overlay ? (
        <ValueContainer
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleInputClick}
        >
		{hover && (
		<div style={{ marginRight: '10px' }}>
			<div onClick={(e) => { e.stopPropagation(); handleDelete(name, elem) }}>
			<DeleteIcon style={{ marginTop: '5px', transition: 'transform 0.3s' }} />
			</div>
		</div>
		)}
          <span
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: 300,
            }}
          >
            {value}
          </span>
        </ValueContainer>
      ) : (
        <TextField
          variant="standard"
          name={`${name}.${elem}`}
          value={value}
          {...props}
		  onFocus={() => setFocused(true)}
        />
      )}
      <Status status={status} />
    </div>
  )
}

export default TextFieldData
