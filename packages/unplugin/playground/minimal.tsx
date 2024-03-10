import { css } from './styled-system/css'
import 'virtual:panda.css'

export const App = () => {
  return (
    <>
      <div
        className={css({
          color: 'green',
        })}
      >
        <span>Hello from Panda</span>
      </div>
    </>
  )
}
