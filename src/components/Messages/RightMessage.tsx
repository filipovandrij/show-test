import { styled } from '@mui/system'
import Markdown from 'react-markdown'
import { Substract } from '../Icons/Substract'

type RightMessageProps = {
  text: string
}

const RightMessageWrapper = styled('div')`
  display: flex;
  justify-content: flex-end;
  position: relative;

  svg {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: rotate(90deg);
  }
`

const RightMessageContent = styled('div')`
  font-family: Axiforma, serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;

  background: #f3e9f5;
  border-radius: ${({ theme: { spacing } }) => spacing(0.5)};
  padding: ${({ theme: { spacing } }) => spacing(0, 2)};
  max-width: 338px;
  margin-right: ${({ theme: { spacing } }) => spacing(2)};
  word-wrap: break-word;
`

export const RightMessage: React.FC<RightMessageProps> = ({ text }) => {
  return (
    <RightMessageWrapper>
      <RightMessageContent>
        <Markdown>{text}</Markdown>
      </RightMessageContent>
      <Substract />
    </RightMessageWrapper>
  )
}
