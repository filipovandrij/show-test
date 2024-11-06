import { memo } from 'react'
import { styled } from '@mui/system'

type Props = {
  parent: string
  child: string
}

const Child = styled('span')`
  color: #212121;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 138%;
`

const Parent = styled('span')`
  color: #9e9e9e;
  font-family: Axiforma;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`

const Container = styled('div')`
  display: flex;
  flex-direction: column;
`

const Header = memo(({ parent, child }: Props) => {
  return (
    <Container>
      <Parent>{parent}</Parent>
      <Child>{child}</Child>
    </Container>
  )
})

export default Header
