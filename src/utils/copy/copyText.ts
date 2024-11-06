export const copyText = (data: string) => {
  const textarea = document.createElement('textarea')
  textarea.value = data
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}
