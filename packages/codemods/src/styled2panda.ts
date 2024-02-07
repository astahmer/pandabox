import MagicString from 'magic-string'
import postcss, { CssSyntaxError } from 'postcss'
import postcssJs from 'postcss-js'
import { Node } from 'ts-morph'
import { getTemplateText, type TemplateToObjectSyntaxOptions } from './template-to-object-syntax'

export interface Styled2PandaOptions extends TemplateToObjectSyntaxOptions {
  withClassName?: boolean
  moduleSpecifier?: string
  factoryName?: string
}

export const styled2panda = (options: Styled2PandaOptions) => {
  const { sourceFile, matchTag } = options

  const withClassName = options.withClassName ?? true
  const factoryName = options.factoryName ?? 'styled'
  const importFrom = options.moduleSpecifier ?? 'styled-components'

  const sourceText = sourceFile.getText()
  const s = new MagicString(sourceText)

  sourceFile.forEachDescendant((node) => {
    if (Node.isImportDeclaration(node)) {
      const moduleSpecifier = node.getModuleSpecifier()
      const importPath = moduleSpecifier.getText()
      if (!importPath.includes(importFrom)) return

      s.update(node.getStart(), node.getEnd(), `import { ${factoryName} } from '../styled-system/jsx'`)
      return
    }

    if (Node.isTaggedTemplateExpression(node)) {
      const tagName = node.getTag().getText()
      if (matchTag && !matchTag(tagName)) return

      const templateText = getTemplateText(node)

      try {
        const variableDecl = node.getParent()
        const obj = postcssJs.objectify(postcss.parse(templateText.slice(1, -1).trim()))
        const json = JSON.stringify(obj, null, 2)

        let factory, tag
        // styled.div`...`
        if (tagName.includes('.')) {
          const split = tagName.split('.')
          factory = split[0]
          tag = `'${split[1]}'`
        } else if (tagName.includes('(')) {
          // styled(Button)`...`
          const split = tagName.split('(')
          factory = split[0]
          tag = split[1].slice(0, -1)
        }

        let transform: string
        if (withClassName && Node.isVariableDeclaration(variableDecl)) {
          const identifier = variableDecl.getNameNode().getText()
          transform = `${factory}(${tag}, { base: ${json} }, { defaultProps: { className: '${identifier}' } })`
        } else {
          transform = `${factory}(${tag}, { base: ${json} })`
        }

        s.update(node.getStart(), node.getEnd(), transform)
      } catch (error) {
        if (error instanceof CssSyntaxError) {
          console.error(error.showSourceCode(true))
        }

        throw error
      }
    }
  })

  return {
    code: s.toString(),
    map: s.generateMap({ hires: true }),
  }
}
