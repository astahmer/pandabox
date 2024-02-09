import 'virtual:panda.css'
import { styled } from '../styled-system/jsx'
import { something } from 'some-module'

export const App = () => {
  return (
    <styled.div
      display="flex"
      flexDirection="column"
      fontWeight="semibold"
      color="green.300"
      textAlign="center"
      textStyle="4xl"
      onClick={() => console.log('hello')}
      unresolvable={something}
    >
      <span>Hello from Panda</span>
    </styled.div>
  )
}
