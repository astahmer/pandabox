import { expect, test, describe } from 'vitest'
import { createMacroContext } from '../src/plugin/create-context'
import { tranformPanda } from '../src/plugin/transform'
import { createConfigResult } from './fixtures'

// @ts-expect-error
import OnlyCss from './samples/only-css?raw'
// @ts-expect-error
import OnlyCva from './samples/only-cva?raw'
// @ts-expect-error
import OnlyPattern from './samples/only-pattern?raw'
// @ts-expect-error
import OnlyRecipe from './samples/only-recipe?raw'
// @ts-expect-error
import OnlyCssRaw from './samples/only-css-raw?raw'
// @ts-expect-error
import CssWithRaw from './samples/css-with-raw?raw'
// @ts-expect-error
import OnlyStyled from './samples/only-styled?raw'
// @ts-expect-error
import FullExample from './samples/full?raw'

const id = 'app.tsx'

describe('atomic', () => {
  const output = 'atomic'

  test('transform css', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = OnlyCss

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { css } from '../styled-system/css'

      export const App = () => {
        return (
          <div
            className={\\"d_flex flex_column font_semibold text_green.300 text_center textStyle_4xl\\"}
          >
            <span>Hello from Panda</span>
          </div>
        )
      }
      "
    `)
  })

  test('unwrap css raw', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = OnlyCssRaw

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { css } from '../styled-system/css'

      const styles = ({
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
      "
    `)
  })

  test.only('ignore unresolved runtime conditions', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = `import 'virtual:panda.css'
    import { css } from '../styled-system/css'
    import { someValue } from 'some-module'

    css({ display: 'flex' });
    css(true ? { fontSize: '1px' } : { fontSize: '2px' });
    css(someValue ? { flexDirection: 'column' } : { flexDirection: 'row' });
    css(someValue ?? { fontWeight: 'semibold' });
    `

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
          import { css } from '../styled-system/css'
          import { someValue } from 'some-module'

          "d_flex";
          "fs_1px";
          css(someValue ? { flexDirection: 'column' } : { flexDirection: 'row' });
          css(someValue ?? { fontWeight: 'semibold' });
          "
    `)
  })

  test('transform cva', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = OnlyCva

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { cva } from '../styled-system/css'

      const atomicRecipe = () => \\"\\"

      export const App = () => {
        return <div className=\\"d_flex bg_red.200 text_white p_4 fs_12px\\">Atomic Button</div>
      }
      "
    `)
  })

  test('transform pattern', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = OnlyPattern

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import { center } from '../styled-system/patterns'

      import 'virtual:panda.css'

      export const App = () => {
        return (
          <div className={\\"d_flex items_center justify_center h_full\\"}>
            <span>Hello from Panda</span>
          </div>
        )
      }
      "
    `)
  })

  test('transform recipe', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = OnlyRecipe

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { button } from '../styled-system/recipes'

      export const App = () => {
        return <div className={\\"d_flex cursor_pointer font_bold bg_red.200 text_slate.800 p_8 fs_40px rounded_full\\"}>Button</div>
      }
      "
    `)
  })

  test('skip transforming recipe with option', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = OnlyRecipe

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult, keepRecipeClassNames: true })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { button } from '../styled-system/recipes'

      export const App = () => {
        return <div className={\\"button button--visual_funky button--size_lg button--shape_circle\\"}>Button</div>
      }
      "
    `)
  })

  test('transform csswithraw', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = CssWithRaw

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { css } from '../styled-system/css'

      const overrides = ({
        bg: 'green.100',
      })

      export const App = () => {
        return (
          <div
            className={\\"d_flex flex_column font_semibold text_red.500 text_center textStyle_4xl bg_green.100\\"}
          >
            <span>Hello from Panda</span>
          </div>
        )
      }
      "
    `)
  })
  test('transform full', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = FullExample

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import { css, cva } from '../styled-system/css'
      import { center } from '../styled-system/patterns'
      import { button } from '../styled-system/recipes'
      import 'virtual:panda.css'

      const overrides = ({
        bg: 'green.100',
      })

      const atomicRecipe = () => \\"\\"

      export const App = () => {
        return (
          <div className={\\"d_flex items_center justify_center h_full\\"}>
            <div
              className={\\"d_flex flex_column font_semibold text_red.500 text_center textStyle_4xl bg_green.100\\"}
            >
              <span>🐼</span>
              <span>Hello from Panda</span>
            </div>
            <div className={\\"d_flex cursor_pointer font_bold bg_red.200 text_slate.800 p_8 fs_40px rounded_full\\"}>Button</div>
            <div className=\\"d_flex bg_red.200 text_white p_4 fs_12px\\">Atomic Button</div>
          </div>
        )
      }
      "
    `)
  })

  test('transform JSX factory', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = OnlyStyled

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { styled } from '../styled-system/jsx'
      import { something } from 'some-module'

      export const App = () => {
        return (
          <div className=\\"d_flex flex_column font_semibold text_green.300 text_center textStyle_4xl\\" onClick={() => console.log('hello')} unresolvable={something}>
            <span>Hello from Panda</span>
          </div>
        )
      }
      "
    `)
  })

  test('transform JSX pattern - Box', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = `import 'virtual:panda.css'
import { Box } from '../styled-system/jsx'
import { something } from 'some-module'

export const App = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      fontWeight="semibold"
      color="green.300"
      textAlign="center"
      textStyle="4xl"
      onClick={() => console.log('hello')}
      unresolvable={something}
    >
      <span>Hello from Panda</span>
    </Box>
  )
}

`

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { Box } from '../styled-system/jsx'
      import { something } from 'some-module'

      export const App = () => {
        return (
          <div className=\\"d_flex flex_column font_semibold text_green.300 text_center textStyle_4xl\\" onClick={() => console.log('hello')} unresolvable={something}>
            <span>Hello from Panda</span>
          </div>
        )
      }

      "
    `)
  })

  test('transform JSX pattern - Stack', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({
        patterns: {
          extend: {
            stack: {
              jsxElement: 'section',
            },
          },
        },
      }),
    })
    const { panda } = ctx
    const code = `import 'virtual:panda.css'
import { Stack } from '../styled-system/jsx'
import { something } from 'some-module'

export const App = () => {
  return (
    <Stack
      fontWeight="semibold"
      color="green.300"
      textAlign="center"
      textStyle="4xl"
      onClick={() => console.log('hello')}
      unresolvable={something}
    >
      <span>Hello from Panda</span>
    </Stack>
  )
}

`

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { Stack } from '../styled-system/jsx'
      import { something } from 'some-module'

      export const App = () => {
        return (
          <section className=\\"d_flex flex_column gap_10px font_semibold text_green.300 text_center textStyle_4xl\\" onClick={() => console.log('hello')} unresolvable={something}>
            <span>Hello from Panda</span>
          </section>
        )
      }

      "
    `)
  })

  test('ignore unknown JSX component', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = `import 'virtual:panda.css'
import { something } from 'some-module'

export const App = () => {
  return (
    <Something
      size="lg"
      onClick={() => console.log('hello')}
      unresolvable={something}
    >
      <span>Hello from Panda</span>
    </Something>
  )
}

`

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { something } from 'some-module'

      export const App = () => {
        return (
          <Something
            size=\\"lg\\"
            onClick={() => console.log('hello')}
            unresolvable={something}
          >
            <span>Hello from Panda</span>
          </Something>
        )
      }

      "
    `)
  })
})

describe('grouped', () => {
  const output = 'grouped'

  test('transform css', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = OnlyCss

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { css } from '../styled-system/css'

      export const App = () => {
        return (
          <div
            className={\\"gTAnXW\\"}
          >
            <span>Hello from Panda</span>
          </div>
        )
      }
      "
    `)
  })

  test('transform cva', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = OnlyCva

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { cva } from '../styled-system/css'

      const atomicRecipe = () => \\"\\"

      export const App = () => {
        return <div className=\\"kUuLsR\\">Atomic Button</div>
      }
      "
    `)
  })

  test('transform pattern', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = OnlyPattern

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import { center } from '../styled-system/patterns'

      import 'virtual:panda.css'

      export const App = () => {
        return (
          <div className={\\"iPSdxj\\"}>
            <span>Hello from Panda</span>
          </div>
        )
      }
      "
    `)
  })

  test('transform recipe', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = OnlyRecipe

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { button } from '../styled-system/recipes'

      export const App = () => {
        return <div className={\\"bcqMaE\\"}>Button</div>
      }
      "
    `)
  })

  test('transform csswithraw', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = CssWithRaw

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { css } from '../styled-system/css'

      const overrides = ({
        bg: 'green.100',
      })

      export const App = () => {
        return (
          <div
            className={\\"cEGjSe\\"}
          >
            <span>Hello from Panda</span>
          </div>
        )
      }
      "
    `)
  })

  test('transform full', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = FullExample

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import { css, cva } from '../styled-system/css'
      import { center } from '../styled-system/patterns'
      import { button } from '../styled-system/recipes'
      import 'virtual:panda.css'

      const overrides = ({
        bg: 'green.100',
      })

      const atomicRecipe = () => \\"\\"

      export const App = () => {
        return (
          <div className={\\"iPSdxj\\"}>
            <div
              className={\\"cEGjSe\\"}
            >
              <span>🐼</span>
              <span>Hello from Panda</span>
            </div>
            <div className={\\"bcqMaE\\"}>Button</div>
            <div className=\\"kUuLsR\\">Atomic Button</div>
          </div>
        )
      }
      "
    `)
  })

  test('transform JSX factory', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = OnlyStyled

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { styled } from '../styled-system/jsx'
      import { something } from 'some-module'

      export const App = () => {
        return (
          <div className=\\"gTAnXW\\" onClick={() => console.log('hello')} unresolvable={something}>
            <span>Hello from Panda</span>
          </div>
        )
      }
      "
    `)
  })

  test('transform JSX pattern - Box', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = `import 'virtual:panda.css'
import { Box } from '../styled-system/jsx'
import { something } from 'some-module'

export const App = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      fontWeight="semibold"
      color="green.300"
      textAlign="center"
      textStyle="4xl"
      onClick={() => console.log('hello')}
      unresolvable={something}
    >
      <span>Hello from Panda</span>
    </Box>
  )
}

`

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { Box } from '../styled-system/jsx'
      import { something } from 'some-module'

      export const App = () => {
        return (
          <div className=\\"gTAnXW\\" onClick={() => console.log('hello')} unresolvable={something}>
            <span>Hello from Panda</span>
          </div>
        )
      }

      "
    `)
  })

  test('transform JSX pattern - Stack', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({
        patterns: {
          extend: {
            stack: {
              jsxElement: 'section',
            },
          },
        },
      }),
    })
    const { panda } = ctx
    const code = `import 'virtual:panda.css'
import { Stack } from '../styled-system/jsx'
import { something } from 'some-module'

export const App = () => {
  return (
    <Stack
      fontWeight="semibold"
      color="green.300"
      textAlign="center"
      textStyle="4xl"
      onClick={() => console.log('hello')}
      unresolvable={something}
    >
      <span>Hello from Panda</span>
    </Stack>
  )
}

`

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { Stack } from '../styled-system/jsx'
      import { something } from 'some-module'

      export const App = () => {
        return (
          <section className=\\"jdxYbG\\" onClick={() => console.log('hello')} unresolvable={something}>
            <span>Hello from Panda</span>
          </section>
        )
      }

      "
    `)
  })

  test('ignore unknown JSX component', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = `import 'virtual:panda.css'
import { something } from 'some-module'

export const App = () => {
  return (
    <Something
      size="lg"
      onClick={() => console.log('hello')}
      unresolvable={something}
    >
      <span>Hello from Panda</span>
    </Something>
  )
}

`

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
      import { something } from 'some-module'

      export const App = () => {
        return (
          <Something
            size=\\"lg\\"
            onClick={() => console.log('hello')}
            unresolvable={something}
          >
            <span>Hello from Panda</span>
          </Something>
        )
      }

      "
    `)
  })
})
