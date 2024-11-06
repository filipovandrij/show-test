import { styled } from '@mui/system'
import Markdown from 'react-markdown'
import { Substract } from '../Icons/Substract'

type LeftMessageProps = {
  text: string
}

const LeftMessageWrapper = styled('div')`
  display: flex;
  justify-content: flex-start;
  position: relative;

  svg {
    position: absolute;
    bottom: 0;
  }
`

const LeftMessageContent = styled('div')`
  font-family: Axiforma, serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;

  background: ${({ theme: { palette } }) => palette.colorBgBase};
  border-radius: ${({ theme: { spacing } }) => spacing(0.5)};
  padding: ${({ theme: { spacing } }) => spacing(0, 2)};
  max-width: 338px;
  margin-left: ${({ theme: { spacing } }) => spacing(2)};
  word-wrap: break-word;
`

export const LeftMessage: React.FC<LeftMessageProps> = ({ text }) => {
  return (
    <LeftMessageWrapper>
      <LeftMessageContent>
        <Markdown>{text}</Markdown>
      </LeftMessageContent>
      <Substract />
    </LeftMessageWrapper>
  )
}
