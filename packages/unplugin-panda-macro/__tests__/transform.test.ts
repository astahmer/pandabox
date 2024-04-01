import { expect, test, describe } from 'vitest'
import { createMacroContext } from '../src/plugin/create-context'
import { tranformPanda } from '../src/plugin/transform'
import { createConfigResult } from '#pandabox/fixtures'
import './env?url'

import OnlyCss from './samples/only-css?raw'
import OnlyCva from './samples/only-cva?raw'
import OnlyPattern from './samples/only-pattern?raw'
import OnlyRecipe from './samples/only-recipe?raw'
import OnlyCssRaw from './samples/only-css-raw?raw'
import CssWithRaw from './samples/css-with-raw?raw'
import OnlyStyled from './samples/only-styled?raw'
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
            className={"d_flex flex_column font_semibold text_green.300 text_center textStyle_4xl"}
          >
            <span>Hello from Panda</span>
          </div>
        )
      }
      "
    `)
  })

  test('transform css only when using `with` import attribute', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = `import 'virtual:panda.css'
    import { box } from '../styled-system/patterns' with { type: "macro" }
    import { box as box2 } from '../styled-system/patterns' with { type: "macro" }
    import { box as box3 } from '../styled-system/patterns'
    import { box as box4 } from '../styled-system/patterns' with { type: "invalid-macro" }
    import { box as box5 } from '../styled-system/patterns' with { invalid: "macro" }

    box({ display: 'flex' });
    box2({ flexDirection: 'column' });
    box3({ fontWeight: 'semibold' });
    box4({ color: 'green.300' });
    box5({ textAlign: 'center' });
    box6({ textStyle: '4xl' });`

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult, onlyMacroImports: true })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
          import { box } from '../styled-system/patterns' with { type: "macro" }
          import { box as box2 } from '../styled-system/patterns' with { type: "macro" }
          import { box as box3 } from '../styled-system/patterns'
          import { box as box4 } from '../styled-system/patterns' with { type: "invalid-macro" }
          import { box as box5 } from '../styled-system/patterns' with { invalid: "macro" }

          "d_flex";
          "flex_column";
          box3({ fontWeight: 'semibold' });
          box4({ color: 'green.300' });
          box5({ textAlign: 'center' });
          box6({ textStyle: '4xl' });"
    `)
  })

  test('transform css only when using with', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = `import 'virtual:panda.css'
    import { css } from '../styled-system/css' with { type: "macro" }
    import { css as css2 } from '../styled-system/css' with { type: "macro" }
    import { css as css3 } from '../styled-system/css'
    import { css as css4 } from '../styled-system/css' with { type: "invalid-macro" }
    import { css as css5 } from '../styled-system/css' with { invalid: "macro" }

    css({ display: 'flex' });
    css2({ flexDirection: 'column' });
    css3({ fontWeight: 'semibold' });
    css4({ color: 'green.300' });
    css5({ textAlign: 'center' });
    css6({ textStyle: '4xl' });`

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult, onlyMacroImports: true })
    expect(result?.code).toMatchInlineSnapshot(`
      "import 'virtual:panda.css'
          import { css } from '../styled-system/css' with { type: "macro" }
          import { css as css2 } from '../styled-system/css' with { type: "macro" }
          import { css as css3 } from '../styled-system/css'
          import { css as css4 } from '../styled-system/css' with { type: "invalid-macro" }
          import { css as css5 } from '../styled-system/css' with { invalid: "macro" }

          "d_flex";
          "flex_column";
          css3({ fontWeight: 'semibold' });
          css4({ color: 'green.300' });
          css5({ textAlign: 'center' });
          css6({ textStyle: '4xl' });"
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

  test('ignore unresolved runtime conditions', () => {
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
      "import { inlineCva } from 'virtual:panda-inline-cva';
      import { addCompoundVariantCss } from 'virtual:panda-compound-variants';
      import 'virtual:panda.css'
      import { cva } from '../styled-system/css'

      const atomicRecipe = (function () {
          const base = {"display":"flex","background":"red.200","color":"white"}
          const variantStyles = {
        "visual": {
          "solid": {
            "display": "flex",
            "background": "red.200",
            "color": "white"
          },
          "outline": {
            "display": "flex",
            "background": "red.200",
            "color": "white"
          }
        },
        "size": {
          "sm": {
            "display": "flex",
            "background": "red.200",
            "color": "white"
          },
          "lg": {
            "display": "flex",
            "background": "red.200",
            "color": "white"
          }
        }
      }

          const defaultVariants = {"visual":"solid"}

          return function atomicRecipe(variants) {
            const classList = [inlineCva(base, defaultVariants, variantStyles, variants)]
            
            const compoundVariants = [{"visual":"outline","size":"lg","css":{"borderWidth":"3px"}}]

            addCompoundVariantCss(compoundVariants, variantProps, classList)

            return classList.join(' ')
          }
        })()

      export const App = () => {
        return <div className="d_flex bg_red.200 text_white p_4 fs_12px">Atomic Button</div>
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
          <div className={"d_flex items_center justify_center h_full"}>
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
        return <div className={"d_flex cursor_pointer font_bold bg_red.200 text_slate.800 p_8 fs_40px rounded_full"}>Button</div>
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
        return <div className={"button button--visual_funky button--size_lg button--shape_circle"}>Button</div>
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
            className={"d_flex flex_column font_semibold text_red.500 text_center textStyle_4xl bg_green.100"}
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
      "import { inlineCva } from 'virtual:panda-inline-cva';
      import { css, cva } from '../styled-system/css'
      import { center } from '../styled-system/patterns'
      import { button } from '../styled-system/recipes'
      import 'virtual:panda.css'

      const overrides = ({
        bg: 'green.100',
      })

      const atomicRecipe = (function () {
          const base = {"display":"flex"}
          const variantStyles = {
        "visual": {
          "solid": {
            "display": "flex"
          },
          "outline": {
            "display": "flex"
          }
        },
        "size": {
          "sm": {
            "display": "flex"
          },
          "lg": {
            "display": "flex"
          }
        }
      }

          const defaultVariants = {}

          return function atomicRecipe(variants) {
            const classList = [inlineCva(base, defaultVariants, variantStyles, variants)]
            

            return classList.join(' ')
          }
        })()

      export const App = () => {
        return (
          <div className={"d_flex items_center justify_center h_full"}>
            <div
              className={"d_flex flex_column font_semibold text_red.500 text_center textStyle_4xl bg_green.100"}
            >
              <span>🐼</span>
              <span>Hello from Panda</span>
            </div>
            <div className={"d_flex cursor_pointer font_bold bg_red.200 text_slate.800 p_8 fs_40px rounded_full"}>Button</div>
            <div className="d_flex bg_red.200 text_white p_4 fs_12px">Atomic Button</div>
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
          <div className="d_flex flex_column font_semibold text_green.300 text_center textStyle_4xl" onClick={() => console.log('hello')} unresolvable={something}>
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
          <div className="d_flex flex_column font_semibold text_green.300 text_center textStyle_4xl" onClick={() => console.log('hello')} unresolvable={something}>
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
          <section className="d_flex flex_column gap_10px font_semibold text_green.300 text_center textStyle_4xl" onClick={() => console.log('hello')} unresolvable={something}>
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
            size="lg"
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

  test('ignore unrelated components', () => {
    const ctx = createMacroContext({
      root: '/',
      conf: createConfigResult({}),
    })
    const { panda } = ctx
    const code = `
  import { Center, Flex as ActualFlex, styled } from './styled-system/jsx'
  import 'virtual:panda.css'

  const Stack = ({ children }: any) => <div data-testid="stack">stack{children}</div>
  const Stack2 = ({ children }: any) => <div data-testid="stack">stack{children}</div>

  export const App = () => {
    return (
      <Center>
        <Stack fontSize="2xl">
          <styled.div border="2px solid token(colors.red.300)">shouldnt be transformed</styled.div>
        </Stack>
        <Stack2 fontSize="2xl">
        shouldnt be transformed
        </Stack2>
        <ActualFlex fontSize="2xl">
          should be transformed
        </ActualFlex>
      </Center>
    )
  }
`

    const sourceFile = panda.project.addSourceFile(id, code)
    const parserResult = panda.project.parseSourceFile(id)

    const result = tranformPanda(ctx, { code, id, output, sourceFile, parserResult })
    expect(result?.code).toMatchInlineSnapshot(`
      "
        import { Center, Flex as ActualFlex, styled } from './styled-system/jsx'
        import 'virtual:panda.css'

        const Stack = ({ children }: any) => <div data-testid="stack">stack{children}</div>
        const Stack2 = ({ children }: any) => <div data-testid="stack">stack{children}</div>

        export const App = () => {
          return (
            <div className="d_flex items_center justify_center" >
              <Stack fontSize="2xl">
                <div className="border_2px_solid_token(colors.red.300)" >shouldnt be transformed</div>
              </Stack>
              <Stack2 fontSize="2xl">
              shouldnt be transformed
              </Stack2>
              <div className="d_flex fs_2xl" >
                should be transformed
              </div>
            </div>
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
            className={"gTAnXW"}
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
      "import { inlineCva } from 'virtual:panda-inline-cva';
      import { addCompoundVariantCss } from 'virtual:panda-compound-variants';
      import 'virtual:panda.css'
      import { cva } from '../styled-system/css'

      const atomicRecipe = (function () {
          const base = {"display":"flex","background":"red.200","color":"white"}
          const variantStyles = {
        "visual": {
          "solid": {
            "display": "flex",
            "background": "red.200",
            "color": "white"
          },
          "outline": {
            "display": "flex",
            "background": "red.200",
            "color": "white"
          }
        },
        "size": {
          "sm": {
            "display": "flex",
            "background": "red.200",
            "color": "white"
          },
          "lg": {
            "display": "flex",
            "background": "red.200",
            "color": "white"
          }
        }
      }

          const defaultVariants = {"visual":"solid"}

          return function atomicRecipe(variants) {
            const classList = [inlineCva(base, defaultVariants, variantStyles, variants)]
            
            const compoundVariants = [{"visual":"outline","size":"lg","css":{"borderWidth":"3px"}}]

            addCompoundVariantCss(compoundVariants, variantProps, classList)

            return classList.join(' ')
          }
        })()

      export const App = () => {
        return <div className="kUuLsR">Atomic Button</div>
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
          <div className={"iPSdxj"}>
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
        return <div className={"bcqMaE"}>Button</div>
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
            className={"cEGjSe"}
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
      "import { inlineCva } from 'virtual:panda-inline-cva';
      import { css, cva } from '../styled-system/css'
      import { center } from '../styled-system/patterns'
      import { button } from '../styled-system/recipes'
      import 'virtual:panda.css'

      const overrides = ({
        bg: 'green.100',
      })

      const atomicRecipe = (function () {
          const base = {"display":"flex"}
          const variantStyles = {
        "visual": {
          "solid": {
            "display": "flex"
          },
          "outline": {
            "display": "flex"
          }
        },
        "size": {
          "sm": {
            "display": "flex"
          },
          "lg": {
            "display": "flex"
          }
        }
      }

          const defaultVariants = {}

          return function atomicRecipe(variants) {
            const classList = [inlineCva(base, defaultVariants, variantStyles, variants)]
            

            return classList.join(' ')
          }
        })()

      export const App = () => {
        return (
          <div className={"iPSdxj"}>
            <div
              className={"cEGjSe"}
            >
              <span>🐼</span>
              <span>Hello from Panda</span>
            </div>
            <div className={"bcqMaE"}>Button</div>
            <div className="kUuLsR">Atomic Button</div>
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
          <div className="gTAnXW" onClick={() => console.log('hello')} unresolvable={something}>
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
          <div className="gTAnXW" onClick={() => console.log('hello')} unresolvable={something}>
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
          <section className="jdxYbG" onClick={() => console.log('hello')} unresolvable={something}>
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
            size="lg"
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
