import { css } from '../styled-system/css'
// @ts-expect-error pluginRemoveFeatures
import { cva } from '../styled-system/css'
// @ts-expect-error pluginRemoveFeatures
import { cva as cva2 } from '../styled-system/css/cva'

function App() {
  return (
    <>
      <div
        className={css({
          color: 'red.100',
          // @ts-expect-error strictTokens + pluginStrictTokensScope
          backgroundColor: '#fff',
          // fontSize: '123px',
          // @ts-expect-error strictTokens + pluginStrictTokensScope + pluginRemoveNegativeSpacing
          margin: '-5',
        })}
      ></div>
    </>
  )
}

export default App
