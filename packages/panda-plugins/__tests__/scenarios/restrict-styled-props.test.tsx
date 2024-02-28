import { test } from 'vitest'
import { styled } from './styled-system-restrict-styled-props/jsx'

test('runtime', () => {
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
})
