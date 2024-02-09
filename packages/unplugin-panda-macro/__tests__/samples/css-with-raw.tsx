import 'virtual:panda.css'
import { css } from '../styled-system/css'

const overrides = css.raw({
  bg: 'green.100',
})

export const App = () => {
  return (
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
      <span>Hello from Panda</span>
    </div>
  )
}
