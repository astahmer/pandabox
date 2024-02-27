import type { CodegenPrepareHookArgs, PandaPlugin } from '@pandacss/types'

export interface MissingCssWarnings {
  enabled?: boolean
}

/**
 * Logs a warning message when a CSS rule was used at runtime but couldn't be statically extracted
 *
 * @see https://github.com/chakra-ui/panda/pull/1194
 */
export const pluginMissingCssWarnings = (options?: MissingCssWarnings): PandaPlugin => {
  return {
    name: 'missing-css-warnings',
    hooks: {
      'codegen:prepare': (args) => {
        return transformMissingCssWarnings(args, options)
      },
    },
  }
}

export const transformMissingCssWarnings = (args: CodegenPrepareHookArgs, options?: MissingCssWarnings) => {
  const { enabled = true } = options ?? {}
  if (!enabled) return args.artifacts

  const helpersArtifact = args.artifacts.find((art) => art.id === 'helpers')
  const helpersFile = helpersArtifact?.files.find((f) => f.file.includes('helpers'))

  if (!helpersFile?.code) {
    return args.artifacts
  }

  helpersFile.code = helpersFile.code.replace(
    'classNames.add(className)',
    'classNames.add(className);\nisInCss(className)',
  )
  helpersFile.code += `
      /* eslint-disable no-control-regex */
      var rcssescape = /([\\0-\\x1f\\x7f]|^-?\\d)|^-$|^-|[^\\x80-\\uFFFF\\w-]/g;
      var fcssescape = function (ch, asCodePoint) {
        if (!asCodePoint) return "\\\\" + ch;
        if (ch === "\\0") return "\\uFFFD";
        if (ch === "-" && ch.length === 1) return "\\\\-";
        return ch.slice(0, -1) + "\\\\" + ch.charCodeAt(ch.length - 1).toString(16);
      };

      var esc = (sel) => {
        return (sel + "").replace(rcssescape, fcssescape);
      };

      const isCssStyleRule = (rule) => rule instanceof CSSStyleRule
      const isGroupingRule = (rule) => 'cssRules' in rule
      function traverseCSSRule(rule, className) {
        const stack = []
        stack.push(rule)
        while (stack.length > 0) {
          const currentRule = stack.pop()
          if (!currentRule) continue
          if (isCssStyleRule(currentRule)) {
            const selectorText = currentRule.selectorText
            if (selectorText && selectorText.includes(className)) {
              return currentRule
            }
          }
          if (isGroupingRule(currentRule) && currentRule.cssRules) {
            stack.push(...Array.from(currentRule.cssRules))
          }
        }
      }
      const missingRules = new Set()
      const isInCss = (className) => {
        if (typeof window === 'undefined') return
        const escaped = '.' + esc(className)
        const styleSheets = document.styleSheets
        for (const styleSheet of styleSheets) {
          const rules = styleSheet.cssRules || styleSheet.rules
          if (!rules) continue
          for (const rule of rules) {
            const match = traverseCSSRule(rule, escaped)
            if (match) return match
          }
        }
        if (missingRules.has(className)) return
        missingRules.add(className)
        console.error(\`No matching CSS rule found for "\${className}"\`)
      }`

  return args.artifacts
}
