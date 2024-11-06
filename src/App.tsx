import { styled } from '@mui/system'
import AppRouter from './app/appRouter'

const Container = styled('div')`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;

  button {
    box-shadow: none;

    .ant-wave {
      display: none;
    }
  }
`

const Content = styled('div')`
  width: 100%;
  flex-grow: 1;
  background-color: ${({ theme: { palette } }) => palette.colorBgContainer};
`

export const App = () => {
  return (
    <Container>
      <Content>
        <AppRouter />
      </Content>
    </Container>
  )
}
