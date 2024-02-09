import 'virtual:panda.css'
import { css } from '../styled-system/css'

export const App = () => {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        fontWeight: 'semibold',
        color: 'green.300',
        textAlign: 'center',
        textStyle: '4xl',
      })}
    >
      <span>Hello from Panda</span>
    </div>
  )
}
