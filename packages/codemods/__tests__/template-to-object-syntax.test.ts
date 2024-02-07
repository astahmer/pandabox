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
    } })"
  `)
})
