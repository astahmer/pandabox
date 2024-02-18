import { css } from './styled-system/css'
// import 'virtual:panda.css'
import pandaCss from 'virtual:panda.css?url'

export const App = () => {
  console.log({
    pandaCss,
  })
  return (
    <>
      <link rel="stylesheet" href={pandaCss} />
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
