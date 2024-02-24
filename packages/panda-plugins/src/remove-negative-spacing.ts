import type { CodegenPrepareHookArgs, PandaPlugin } from '@pandacss/types'

export interface NegativeTransformOptions {
  spacingTokenType?: boolean
  tokenType?: boolean
}

/**
 * Removes negative spacing tokens from the `styled-system` generated folder.
 * - `spacingTokenType`: Removes negative spacing tokens from `tokens.d.ts`
 * - `tokenType`: Removes negative tokens from `tokens.d.ts`
 *
 * @default options: { spacingTokenType: true, tokenType: true }`
 */
export const pluginRemoveNegativeSpacing = (options?: NegativeTransformOptions): PandaPlugin => {
  return {
    name: 'remove-negative-spacing',
    hooks: {
      'codegen:prepare': (args) => {
        return transformNegativeSpacing(args, options ?? {})
      },
    },
  }
}

export const transformNegativeSpacing = (args: CodegenPrepareHookArgs, options: NegativeTransformOptions) => {
  const artifact = args.artifacts.find((a) => a.id === 'design-tokens')
  if (!artifact) return args.artifacts

  const artifactContent = artifact.files.find((f) => f.file.includes('tokens.d'))
  if (!artifactContent) return args.artifacts

  let fileContent = artifactContent.code
  if (!fileContent) return args.artifacts

  const { spacingTokenType = true, tokenType = true } = options
  if (spacingTokenType) {
    fileContent = artifactContent.code = updateSpacingTokenType(fileContent)
  }

  if (tokenType) {
    artifactContent.code = updateTokenType(fileContent)
  }

  return args.artifacts
}

const spacingTokenRegex = /export type SpacingToken = (.+)\n/
const tokenRegex = /export type Token = (.+)\n/

const updateSpacingTokenType = (file: string) => {
  const match = file.match(spacingTokenRegex)
  if (!match) return file

  const spacingTokenString = match[1]
  const values = spacingTokenString
    .split(' | ')
    .map((v) => v.slice(1, -1))
    .filter((v) => !v.startsWith('-'))

  return file.replace(spacingTokenRegex, `export type SpacingToken = ${values.map((v) => `"${v}"`).join(' | ')}\n`)
}

const updateTokenType = (file: string) => {
  const match = file.match(tokenRegex)
  if (!match) return file

  const tokenString = match[1]
  const values = tokenString
    .split(' | ')
    .map((v) => v.slice(1, -1))
    .filter((v) => !v.startsWith('spacing.-'))

  return file.replace(tokenRegex, `export type Token = ${values.map((v) => `"${v}"`).join(' | ')}\n`)
}
