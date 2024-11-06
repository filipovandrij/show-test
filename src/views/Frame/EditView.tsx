import { useContext, useEffect, useRef, useState } from 'react'
import { styled } from '@mui/system'
import { Box, IconButton, MenuItem, Select } from '@mui/material'
import { AppContext } from '../../app/appContext'
import { fetchCaseById, updateCase } from '../AIFrame/Analyzer/Requests/requestsCase'
import { fetchCandidateById, updateCandidate } from '../AIFrame/Analyzer/Requests/candidates'
import {
  BoldIcon,
  CodeIcon,
  CrossIcon,
  ItalicIcon,
  ListIcon,
  OrderListIcon,
  UnderlineIcon,
} from './RichEditorIcons'

const EditViewContent = styled('div')`
  padding-top: 0px;
  text-align: justify;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  color: #212121;
`

const StyledTextarea = styled('textarea')`
  font-family: Roboto;
  font-size: 16px;
  font-weight: 600;
  background-color: #fafafa;
  padding: 8px;
  border: none;
  border-radius: 8px;
  resize: none;
  outline: none;
  color: #212121;
`

const StyledInput = styled('input')`
  font-family: Axiforma;
  font-size: 16px;
  font-weight: 600;
  background-color: #fafafa;
  padding: 8px;
  border: none;
  border-radius: 8px;
  outline: none;
`

type Props = {
  close: () => void
}
const EditView = ({ close }: Props) => {
  close
  const { frameId } = useContext(AppContext)
  const [id, name, where] = frameId.split('-')
  const [titleText, setTitleText] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const initialData = useRef({ title: '', content: '' })
  const localStorageKeyTitle = `title-${name}-${id}-${where}`
  const localStorageKeyContent = `content-${name}-${id}-${where}`

  useEffect(() => {
    async function loadInitialData() {
      if (where === 'candidate') {
        const innerCase = await fetchCandidateById(Number(id))
        const localTitle = localStorage.getItem(localStorageKeyTitle)
        const localContent = localStorage.getItem(localStorageKeyContent)
        const initTitle = localTitle || (innerCase[name] && innerCase[name].title) || ''
        const initContent = localContent || (innerCase[name] && innerCase[name].text) || ''
        setTitleText(initTitle)
        setContent(initContent)
        initialData.current = { title: initTitle, content: initContent }
      } else if (where === 'job') {
        const innerCase = await fetchCaseById(Number(id))
        const localTitle = localStorage.getItem(localStorageKeyTitle)
        const localContent = localStorage.getItem(localStorageKeyContent)

        const initTitle =
          localTitle ||
          (innerCase.job_description[name] && innerCase.job_description[name].title) ||
          ''
        const initContent =
          localContent ||
          (innerCase.job_description[name] && innerCase.job_description[name].text) ||
          ''
        setTitleText(initTitle)
        setContent(initContent)
        initialData.current = { title: initTitle, content: initContent }
      }
    }

    loadInitialData()
  }, [id, name, localStorageKeyTitle, localStorageKeyContent])

  const handleTitleChange = (event: any) => {
    const newTitle = event.target.value
    setTitleText(newTitle)
    localStorage.setItem(localStorageKeyTitle, newTitle)
  }

  const handleContentChange = (event: any) => {
    const newContent = event.target.value
    setContent(newContent)
    localStorage.setItem(localStorageKeyContent, newContent)
  }

  const saveAnyChanges = async () => {
    if (where === 'candidate') {
      await updateCandidate(Number(id), {
        [name]: {
          title: titleText,
          text: content,
        },
      })

      chrome.runtime.sendMessage({ type: 'UPDATE_DATA' })
    }
    if (where === 'job') {
      await updateCase(Number(id), {
        [name]: {
          title: titleText,
          text: content,
        },
      })
      chrome.runtime.sendMessage({ type: 'UPDATE_DATA' })
    }
  }

  // const cancelChanges = () => {
  //   setTitleText(initialData.current.title)
  //   localStorage.setItem(localStorageKeyTitle, initialData.current.title)
  //   setContent(initialData.current.content)
  //   localStorage.setItem(localStorageKeyContent, initialData.current.content)
  //   close()
  // }

  const contentRef = useRef<HTMLTextAreaElement>(null)
  const selectionRef = useRef({ start: 0, end: 0 })

  const getSelectedLine = (
    sstart = selectionRef.current.start,
    send = selectionRef.current.end
  ): [string, number, number, string] | null => {
    const content = contentRef.current?.textContent
    if (!content) return null

    let lineStart = content
      .split('')
      .reverse()
      .join('')
      .indexOf('\n', content.length - sstart)
    let lineEnd = content.indexOf('\n', send)
    lineStart = lineStart === -1 ? 0 : content.length - lineStart
    lineEnd = lineEnd === -1 ? content.length - 1 : lineEnd
    const line = content.substring(lineStart, lineEnd)
    return [line, lineStart, lineEnd, content]
  }

  useEffect(() => {
    if (contentRef.current) {
      const selection = () => {
        if (contentRef.current?.selectionStart && contentRef.current?.selectionEnd) {
          selectionRef.current = {
            start: contentRef.current?.selectionStart,
            end: contentRef.current?.selectionEnd,
          }
        }

        const res = getSelectedLine()
        if (!res) return
        const [line] = res
        if (line.startsWith('#')) {
          const res = line.match(/^#+ /)
          if (res) {
            setHeading(`heading${res[0].length - 1}`)
          }
        } else {
          setHeading('text')
        }
      }
      contentRef.current?.addEventListener('keypress', selection) // Every character written
      contentRef.current?.addEventListener('mousedown', selection) // Click down
      contentRef.current?.addEventListener('mouseup', selection) // Click up
      contentRef.current?.addEventListener('touchstart', selection) // Mobile
      contentRef.current?.addEventListener('input', selection) // Other input events
      contentRef.current?.addEventListener('paste', selection) // Clipboard actions
      contentRef.current?.addEventListener('cut', selection)
      contentRef.current?.addEventListener('mousemove', selection) // Selection, dragging text
      contentRef.current?.addEventListener('select', selection) // Some browsers support this event
      contentRef.current?.addEventListener('selectstart', selection) // Some browsers support this event
    }
  }, [contentRef.current])

  const [heading, setHeading] = useState('text')
  const applyHeading = (heading = 'text') => {
    setHeading(heading)
    const res = getSelectedLine()
    if (!res) {
      console.log('applyHeading is undefined')
      return
    }
    const [line, lineStart, lineEnd, content] = res
    let newLine = ''
    if (heading.startsWith('text')) {
      newLine = line.replace(/^#+ /, '')
    } else {
      newLine = line.replace(/^#* ?/, `${'#'.repeat(parseInt(heading.substring(7), 10))} `)
    }
    const diff = newLine.length - line.length
    selectionRef.current = {
      start: selectionRef.current.start + diff,
      end: selectionRef.current.end + diff,
    }
    setContent(content.substring(0, lineStart) + newLine + content.substring(lineEnd))
  }
  const applyListNumber = () => {
    const res = getSelectedLine()
    if (!res) {
      console.log('applyListNumber is undefined')
      return
    }
    const [line, lineStart, lineEnd, content] = res
    let newLine = ''
    if (line.search(/^ \d+. /) !== -1) {
      newLine = line.replace(/^ \d+. /, '')
    } else {
      const [prevLine] = getSelectedLine(lineStart - 1, lineStart - 1) ?? ['']
      let newNumber = 1
      if (lineStart !== 0 && prevLine.search(/^ \d+. /) !== -1) {
        newNumber = parseInt(prevLine.substring(1, prevLine.indexOf('.')), 10) + 1
      }
      newLine = line.replace(/^ ?-? ?/, ` ${newNumber}. `)
    }
    const diff = newLine.length - line.length
    selectionRef.current = {
      start: selectionRef.current.start + diff,
      end: selectionRef.current.end + diff,
    }
    setContent(content.substring(0, lineStart) + newLine + content.substring(lineEnd))
  }
  const applyList = () => {
    const res = getSelectedLine()
    if (!res) {
      console.log('applyList is undefined')
      return
    }
    const [line, lineStart, lineEnd, content] = res
    let newLine = ''
    if (line.search(/^ - /) !== -1) {
      newLine = line.replace(/^ - /, '')
    } else {
      newLine = line.replace(/^ ?\d*\.? ?/, ' - ')
    }
    const diff = newLine.length - line.length
    selectionRef.current = {
      start: selectionRef.current.start + diff,
      end: selectionRef.current.end + diff,
    }
    setContent(content.substring(0, lineStart) + newLine + content.substring(lineEnd))
  }
  const toggleHighlight = (highlight: string) => {
    let lineStart = selectionRef.current.start,
      lineEnd = selectionRef.current.end
    const content = contentRef.current?.textContent
    if (!content) {
      console.log('toggleHighlight is undefined')
      return
    }
    const line = content?.substring(lineStart, lineEnd)
    let newLine = '',
      diff = 0
    if (
      content.substring(lineStart - highlight.length, lineStart) === highlight &&
      content.substring(lineEnd, lineEnd + highlight.length) === highlight
    ) {
      lineStart -= highlight.length
      lineEnd += highlight.length
      newLine = line
      diff = -highlight.length
    } else {
      newLine = `${highlight}${line}${highlight}`
      diff = highlight.length
    }
    selectionRef.current = {
      start: selectionRef.current.start + diff,
      end: selectionRef.current.end + diff,
    }
    setContent(content.substring(0, lineStart) + newLine + content.substring(lineEnd))
  }

  const MenuItemHeading = (props: any) => {
    const { children } = props
    return (
      <MenuItem
        sx={{
          fontFamily: 'Axiforma',
          fontWeight: 600,
        }}
        {...props}
      >
        {children}
      </MenuItem>
    )
  }
  return (
    <EditViewContent>
      <StyledInput value={titleText} onChange={handleTitleChange} placeholder='Text name' />
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '6px' }}>
        <Select
          id='select-heading'
          value={heading}
          onChange={(e) => applyHeading(e.target.value)}
          disableUnderline
          sx={{
            fontFamily: 'Axiforma',
            fontWeight: 600,
            outline: 'none',
            boxShadow: 'none',
            '.MuiOutlinedInput-notchedOutline': { border: 0 },
            '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
              border: 0,
            },
            '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 0,
            },
          }}
          MenuProps={{
            sx: {
              '& .Mui-selected': {
                backgroundColor: '#ebebeb',
                color: '#727272',
                '&.Mui-focusVisible': { backgroundColor: '#ebebeb' },
                outline: 'none',
              },
              outline: 'none',
            },
            PaperProps: {
              sx: {
                backgroundColor: '#ebebeb',
                outline: 'none',
              },
            },
          }}
        >
          <MenuItemHeading value={'text'}>Text</MenuItemHeading>
          <MenuItemHeading value={'heading1'}>Heading1</MenuItemHeading>
          <MenuItemHeading value={'heading2'}>Heading2</MenuItemHeading>
          <MenuItemHeading value={'heading3'}>Heading3</MenuItemHeading>
          <MenuItemHeading value={'heading4'}>Heading4</MenuItemHeading>
          <MenuItemHeading value={'heading5'}>Heading5</MenuItemHeading>
        </Select>
        <IconButton title='listNumber' onClick={applyListNumber}>
          <OrderListIcon />
        </IconButton>
        <IconButton title='list' onClick={applyList}>
          <ListIcon />
        </IconButton>
        <IconButton title='bold' onClick={() => toggleHighlight('**')}>
          <BoldIcon />
        </IconButton>
        <IconButton title='italic' onClick={() => toggleHighlight('*')}>
          <ItalicIcon />
        </IconButton>
        <IconButton title='cross' onClick={() => toggleHighlight('~~')}>
          <CrossIcon />
        </IconButton>
        <IconButton title='underline' onClick={() => toggleHighlight('_')}>
          <UnderlineIcon />
        </IconButton>
        <IconButton title='code' onClick={() => toggleHighlight('`')}>
          <CodeIcon />
        </IconButton>
      </Box>
      <StyledTextarea
        ref={contentRef}
        placeholder='Text content'
        rows={17}
        value={content}
        onChange={handleContentChange}
      />
      <Box
        sx={{
          fontFamily: 'Axiforma',
          textAlign: 'left',
          color: content.length > 10000 ? '#F44336' : '#9E9E9E',
        }}
      >
        {content.length} / 10000
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* <Button
          onClick={saveAnyChanges}
          color='primary'
          variant='contained'
          disabled={content.length > 10000}
        >
          Done
        </Button> */}
        <Box
          onClick={saveAnyChanges}
          // onClick={cancelChanges}
          style={{
            fontFamily: 'Axiforma',
            fontSize: '14px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: '#AB47BC',
          }}
        >
          Done
        </Box>
      </Box>
    </EditViewContent>
  )
}

export default EditView
