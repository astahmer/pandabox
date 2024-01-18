import { defineTheme } from '../src/define-theme'

const t = defineTheme({ strictPropertyValues: false })

const builder = t
  .conditions({
    hover: '&:hover',
  })
  .utilities({
    display: {
      className: 'd',
    },
  })

const config = builder.build()

config.defineStyles({
  display: 'flex',
})

//

const withStrictTokens = defineTheme({ strictPropertyValues: true })
  .conditions({
    hover: '&:hover',
  })
  .utilities({
    display: {
      className: 'd',
    },
  })
  .build()

withStrictTokens.defineStyles({
  background: 'blue',
  color: 'aaa',
  //   @ts-expect-error
  display: 'xxx',
  _hover: {
    //   @ts-expect-error
    display: 'bbb',
  },
  '&:hover': {
    display: 'flex',
  },
})
