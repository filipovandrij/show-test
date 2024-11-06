import React, { useEffect, useRef, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import { Box, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { updateCandidate } from '../../Requests/candidates'
import pdfFileIcon from '../../../../../img/pdfFileIcon.svg'
import Status from '../../styles/Statuses'

type Props = {
  item: any
}

const UploadPDFCandidate = ({ item }: Props) => {
  const fileName = item.extracted_pdf?.title || null
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      try {
        const base64String = await convertToBase64(file)
        await updateCandidate(item.id, { extracted_pdf: { title: file.name, text: base64String } })

        chrome.runtime.sendMessage({ type: 'UPDATE_DATA' })
      } catch (error) {
        console.error('Ошибка при конвертации файла в Base64:', error)
      }
    }
  }

  const onDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file) {
      try {
        const base64String = await convertToBase64(file)
        await updateCandidate(item.id, { extracted_pdf: { title: file.name, text: base64String } })

        chrome.runtime.sendMessage({ type: 'UPDATE_DATA' })
      } catch (error) {
        console.error('Ошибка при конвертации файла в Base64:', error)
      }
    }
  }

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject('Result of FileReader is not a string.')
        }
      }
      reader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const getShortName = (name: string) => {
    return name.length > 20 ? `${name.substring(0, 18)}...` : name
  }

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === 'START_UPLOAD_PDF' && fileInputRef.current) {
        fileInputRef.current.click()
      }
    }
    chrome.runtime.onMessage.addListener(handleMessage)
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        backgroundColor: '#EFF2F4',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '5px',
      }}
    >
      {fileName !== null && (
        <Box
          sx={{
            fontFamily: 'Axiforma',
            fontSize: '12px',
            fontWeight: '500',
            lineHeight: '14.4px',
            color: '#757575',
            margin: '6px 10px 4px',
          }}
        >
          <span>Additional Job info</span>
        </Box>
      )}

      {fileName !== null && (
        <Box
          className='list-pdf'
          sx={{
            width: '93%',
            display: 'flex',
            boxShadow: '0px 0px 2px 0px #0000003D',
            backgroundColor: 'white',
            justifyContent: 'space-between',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <img src={pdfFileIcon} alt='pdf icon' width={24} height={24} />
            <span
              style={{
                fontFamily: 'Axiforma',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              {getShortName(fileName)}
            </span>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Status status='done' />
            <IconButton
              onClick={() => {
                updateCandidate(item.id, {
                  extracted_pdf: {},
                })
                chrome.runtime.sendMessage({ type: 'UPDATE_DATA' })
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      )}
      <input
        ref={fileInputRef}
        type='file'
        accept='.pdf'
        onChange={onFileChange}
        style={{ display: 'none' }}
        id='fileInput'
      />
      <label htmlFor='fileInput' style={{ cursor: 'pointer' }}>
        <Box
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          sx={{
            fontFamily: 'Axiforma',
            fontSize: '14px',
            fontWeight: '500',
            width: '382px',
            border: `2px dashed  ${isDragOver ? '#2196F3' : '#AB47BC'}`,
            padding: '8px',
            textAlign: 'center',
            backgroundColor: isDragOver ? '#E8F4FE' : '#fff',
            color: isDragOver ? '#2196F3' : 'black',
            borderRadius: '10px',
            transition: 'background-color 0.3s ,color 0.3s ,border 0.3s  ',
          }}
        >
          {fileName ? (
            <Tooltip title={fileName} placement='top'>
              <span>
                Drag a file here or
                <span
                  style={{
                    color: '#0B79D0',
                  }}
                >
                  browse
                </span>
                for a file to upload.
                {/* Upload PDF file: {getShortName(fileName)} */}
              </span>
            </Tooltip>
          ) : (
            <span>
              Drag a file here or <span> browse </span> for a file to upload.
            </span>
          )}
        </Box>
      </label>
    </Box>
  )
}

export default UploadPDFCandidate
