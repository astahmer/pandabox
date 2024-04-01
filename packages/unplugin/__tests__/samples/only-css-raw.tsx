import 'virtual:panda.css'
import { css } from '../styled-system/css'

const styles = css.raw({
  display: 'flex',
  flexDirection: 'column',
  fontWeight: 'semibold',
  color: 'green.300',
  textAlign: 'center',
  textStyle: '4xl',
})

export const App = () => {
  return (
    <div>
      <span>Hello from Panda</span>
    </div>
  )
}
