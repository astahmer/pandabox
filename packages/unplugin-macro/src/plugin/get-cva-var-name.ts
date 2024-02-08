import { Node } from 'ts-morph'

export const getVariableName = (node: Node) => {
  const parent = node.getParent()
  if (!Node.isVariableDeclaration(parent)) return

  const name = parent.getName()
  return name
}
