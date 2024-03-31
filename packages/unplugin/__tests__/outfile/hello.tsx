import { css } from './styled-system/css'
import './panda.css'

export const App = () => {
  return (
    <>
      <div data-testid="hello" className={css({ fontSize: '12px' })}>
        Hello from Panda
      </div>
    </>
  )
}
