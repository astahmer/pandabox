import type { ImportDeclaration } from 'ts-morph'
import { Node } from 'ts-morph'

export const getMacroAttribute = (node: ImportDeclaration, attrName = 'type') => {
  const attrs = node.getAttributes()
  if (!attrs) return null

  const elements = attrs.getElements()
  if (!elements.length) return null

  let withAttr: string | null = null
  elements.some((n) => {
    const name = n.getName()
    if (name !== attrName) return

    const value = n.getValue()
    if (!Node.isStringLiteral(value)) return

    withAttr = value.getLiteralText()
    return true
  })

  return withAttr
}
