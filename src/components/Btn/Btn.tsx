import { FunctionComponent, ReactNode } from 'react'
import { ButtonStyled } from './style'

export type Props = {
  onClick?: () => void
  big?: boolean
  children: ReactNode
  setIsHovered?: (isHovered: boolean) => void
}

const Btn: FunctionComponent<Props> = ({ setIsHovered, big, onClick, children }) => {
  return (
    <ButtonStyled
      onClick={onClick}
      big={big}
      onMouseEnter={() => setIsHovered?.(true)}
      onMouseLeave={() => setIsHovered?.(false)}
    >
      {children}
    </ButtonStyled>
  )
}
export default Btn
