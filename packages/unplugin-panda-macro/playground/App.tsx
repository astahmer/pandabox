import { css, cva } from './styled-system/css'
import { center } from './styled-system/patterns'
import { button } from './styled-system/recipes'
import { Stack, styled } from './styled-system/jsx'
import 'virtual:panda.css'

const overrides = css.raw({
  bg: 'green.100',
})

const atomicRecipe = cva({
  base: {
    display: 'flex',
  },
  variants: {
    visual: {
      solid: { bg: 'red.200', color: 'white' },
      outline: { borderWidth: '1px', borderColor: 'red.200' },
    },
    size: {
      sm: { padding: '4', fontSize: '12px' },
      lg: { padding: '8', fontSize: '24px' },
    },
  },
})

export const App = () => {
  return (
    <div className={center({ h: 'full' })}>
      <div
        className={css(
          {
            display: 'flex',
            flexDirection: 'column',
            fontWeight: 'semibold',
            color: 'green.300',
            textAlign: 'center',
            textStyle: '4xl',
          },
          {
            bg: 'yellow.200',
            color: 'red.500',
          },
          overrides,
        )}
      >
        <Stack fontSize="2xl">
          <styled.div border="2px solid token(colors.red.300)">🐼</styled.div>
          <span>Hello from Panda</span>
        </Stack>
      </div>
      <div className={button({ visual: 'funky', size: 'lg' })}>Button</div>
      <div className={atomicRecipe({ visual: 'solid', size: 'sm' })}>Atomic Button</div>
    </div>
  )
}
