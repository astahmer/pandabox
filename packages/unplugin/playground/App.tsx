import { css, cva } from './styled-system/css'
import { center } from './styled-system/patterns'
import { button } from './styled-system/recipes'
import { Stack, styled } from './styled-system/jsx'
import './many-files/many-files_1/import-all';
// import './many-files/many-files_2/import-all';
// import './many-files/many-files_3/import-all';

const overrides = css.raw({
  bg: 'purple.500',
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

console.log(atomicRecipe({ visual: 'outline' }))

export const App = () => {
  return (
    <div className={center({ h: 'full' })}>
      <div
        className={css(
          {
            textStyle: '4xl',
            display: 'flex',
            flexDirection: 'column',
            color: 'green.300',
            textAlign: 'center',
            fontWeight: 'semibold',
          },
          {
            color: 'red.500',
            bg: 'yellow.200',
          },
          overrides,
        )}
      >
        <Stack fontSize="2xl">
          <styled.div border="2px solid token(colors.red.300)">🐼</styled.div>
          <span>Hello from Panda</span>
        </Stack>
      </div>
      <div className={button({ size: 'lg', visual: 'funky' })}>Button</div>
      <div className={atomicRecipe({ visual: 'solid', size: 'sm' })}>Atomic Button</div>
    </div>
  )
}
