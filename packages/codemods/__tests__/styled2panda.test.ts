import { test, expect } from 'vitest'
import { styled2panda } from '../src/styled2panda'
import { Project } from 'ts-morph'
import outdent from 'outdent'

const project = new Project()
const createSourceFile = (content: string) => project.createSourceFile('app.tsx', content, { overwrite: true })

test('import transform', () => {
  const sourceFile = createSourceFile(outdent`
  import styled from 'styled-components'
    `)

  expect(styled2panda({ sourceFile }).code).toMatchInlineSnapshot(`"import { styled } from '../styled-system/jsx'"`)
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

  expect(styled2panda({ sourceFile }).code).toMatchInlineSnapshot(`
    "import { styled } from '../styled-system/jsx'

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

test('composition', () => {
  const sourceFile = createSourceFile(outdent`
  "import styled from 'styled-components'

  // The Button from the last section without the interpolations
  const Button = styled.button\`
    color: #BF4F74;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid #BF4F74;
    border-radius: 3px;
    \`;

  // A new component based on Button, but with some override styles
  const TomatoButton = styled(Button)\`
    color: tomato;
    border-color: tomato;
    \`;
    `)

  expect(styled2panda({ sourceFile }).code).toMatchInlineSnapshot(`
    ""import styled from 'styled-components'

    // The Button from the last section without the interpolations
    const Button = styled('button', { base: {
      "color": "#BF4F74",
      "fontSize": "1em",
      "margin": "1em",
      "padding": "0.25em 1em",
      "border": "2px solid #BF4F74",
      "borderRadius": "3px"
    } }, { defaultProps: { className: 'Button' } });

    // A new component based on Button, but with some override styles
    const TomatoButton = styled(Button, { base: {
      "color": "tomato",
      "borderColor": "tomato"
    } }, { defaultProps: { className: 'TomatoButton' } });"
  `)
})
