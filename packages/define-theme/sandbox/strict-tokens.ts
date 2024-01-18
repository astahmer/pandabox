import { defineTheme } from '../src/define-theme'

const t = defineTheme({ strictTokens: false })

const builder = t
  .conditions({
    hover: '&:hover',
  })
  .tokens({
    colors: {
      blue: {
        500: { value: '#0000ff' },
      },
    },
  })

const config = builder.build()

config.defineStyles({
  color: 'xxx',
})

//

const withStrictTokens = defineTheme({ strictTokens: true })
  .conditions({
    hover: '&:hover',
  })
  .tokens({
    colors: {
      blue: {
        500: { value: '#0000ff' },
      },
      red: {
        DEFAULT: { value: 'red' },
        400: { value: 'xxx' },
      },
    },
  })
  .utilities({
    display: {
      className: 'd',
    },
    color: {
      className: 'c',
      values: 'colors',
    },
    background: {
      className: 'bg',
      values: 'colors',
    },
  })
  .build()

type ColorPropValue = (typeof withStrictTokens)['_propertyValues']['color']
type ColorProp = (typeof withStrictTokens)['_properties']['color']

// type DisplayPropValue = (typeof withStrictTokens)['_propertyValues']['display']
// type DisplayProp = (typeof withStrictTokens)['_properties']['display']

withStrictTokens.defineStyles({
  background: 'blue.500',
  color: 'red',
  display: 'aaa',
  _hover: {
    background: 'red.400',
    // @ts-expect-error
    color: 'aaa',
    display: 'bbb',
  },
  '&:hover': {
    display: 'flex',
  },
})
