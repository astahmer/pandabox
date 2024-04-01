// @ts-nocheck
export function addCompoundVariantCss(compoundVariants, variants, classList) {
  compoundVariants.forEach(({ css, ...compoundVariant }) => {
    if (css) {
      const isMatching = Object.entries(compoundVariant).every(([key, value]) => {
        const values = Array.isArray(value) ? value : [value]
        return values.some((value) => variants[key] === value)
      })

      if (isMatching) {
        classList.push(css)
      }
    }
  })
}

// @ts-expect-error
export function inlineCva(base, defaultVariants, variantStyles, variants) {
  const classList = [base]
  const variantProps = { ...defaultVariants, ...variants }

  for (const [key, value] of Object.entries(variantProps)) {
    if (variantStyles[key][value]) {
      classList.push(variantStyles[key][value])
    }
  }

  return classList.join(' ')
}
