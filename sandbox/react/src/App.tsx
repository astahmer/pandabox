import { styled } from '../styled-system/jsx'

const Button = styled('button', {
  base: {
    color: 'red.200',
  },
  props: ['color', 'bg', 'css'],
})

const Basic = styled('div', {
  base: {
    color: 'red.200',
  },
})

function App() {
  return (
    <>
      <Button
        //
        bg="red.500"
        // @ts-expect-error
        fontSize="3xl"
        className="aaa"
        css={{ fontSize: '2xl' }}
      >
        button
      </Button>
      <p></p>
      <Basic
        //
        bg="amber.100"
        fontSize="3xl"
        className="aaa"
      >
        basic
      </Basic>
    </>
  )
}

export default App
