import type { ImportDeclaration } from 'ts-morph'
import { Node } from 'ts-morph'

export const hasMacroAttribute = (node: ImportDeclaration) => {
  const attrs = node.getAttributes()
  if (!attrs) return

  const elements = attrs.getElements()
  if (!elements.length) return

  return elements.some((n) => {
    const name = n.getName()
    if (name === 'type') {
      const value = n.getValue()
      if (!Node.isStringLiteral(value)) return

      const type = value.getLiteralText()
      if (type === 'macro') {
        return true
      }
    }
  })
}
