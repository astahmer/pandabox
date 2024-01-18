import deepmerge from 'deepmerge'

export class ThemeBuilderImpl {
  _conditions: any
  _breakpoints: any
  _tokens: any
  _semanticTokens: any
  _utilities: any
  _textStyles: any

  constructor(public _options: any = {}) {}

  conditions(defs: any) {
    this._conditions = deepmerge(this._conditions ?? {}, defs)
    return this
  }

  breakpoints(defs: any) {
    this._breakpoints = deepmerge(this._breakpoints ?? {}, defs)
    return this
  }

  tokens(tokens: any) {
    this._tokens = deepmerge(this._tokens ?? {}, tokens)
    return this
  }

  semanticTokens(tokens: any) {
    this._semanticTokens = deepmerge(this._semanticTokens ?? {}, tokens)
    return this
  }

  utilities(utilities: any) {
    this._utilities = deepmerge(this._utilities ?? {}, utilities)
    return this
  }

  textStyles(textStyles: any) {
    this._textStyles = deepmerge(this._textStyles ?? {}, textStyles)
    return this
  }

  build() {
    return new ThemeConfigImpl()
  }
}

const identity = (x: any) => x
class ThemeConfigImpl {
  defineRecipe = identity
  defineStyles = identity
}
