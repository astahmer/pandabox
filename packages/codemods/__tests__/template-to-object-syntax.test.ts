import { test, expect } from 'vitest'
import { templateLiteralToObjectSyntax } from '../src/template-to-object-syntax'
import { Project } from 'ts-morph'
import outdent from 'outdent'

const project = new Project()
const createSourceFile = (content: string) => project.createSourceFile('app.tsx', content, { overwrite: true })

test('simple', () => {
  const sourceFile = createSourceFile(outdent`
    import { styled } from '../styled-system/jsx'

    const Button = styled.button\`
        background-color: #fff;
        border: 1px solid #000;
        color: #000;
        padding: 0.5rem 1rem;

        @media (min-width: 768px) {
        padding: 1rem 2rem;
        }
    \`
    `)

  expect(templateLiteralToObjectSyntax({ sourceFile }).code).toMatchInlineSnapshot(`
    "import { styled } from '../styled-system/jsx'

    const Button = styled('button', { base: {
      "backgroundColor": "#fff",
      "border": "1px solid #000",
      "color": "#000",
      "padding": "0.5rem 1rem",
      "@media (min-width: 768px)": {
        "padding": "1rem 2rem"
      }
    } }, { defaultProps: { className: 'Button' } })"
  `)
})

test('component auto className references', () => {
  const sourceFile = createSourceFile(outdent`
  import styled from 'styled-components'

  const Link = styled.a\`
    background: papayawhip;
    color: #bf4f74;
    \`

  const Icon = styled.svg\`
    width: 48px;
    height: 48px;

    \${Link}:hover & {
      fill: rebeccapurple;
    }
    \`
    `)

  expect(templateLiteralToObjectSyntax({ sourceFile }).code).toMatchInlineSnapshot(`
    "import styled from 'styled-components'

    const Link = styled('a', { base: {
      "background": "papayawhip",
      "color": "#bf4f74"
    } }, { defaultProps: { className: 'Link' } })

    const Icon = styled('svg', { base: {
      "width": "48px",
      "height": "48px",
      ".Link:hover &": {
        "fill": "rebeccapurple"
      }
    } }, { defaultProps: { className: 'Icon' } })"
  `)
})
