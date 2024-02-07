import { css, cx } from '#styled-system/css'
import { splitCssProps } from '#styled-system/jsx'
import { switchRecipe, type SwitchRecipeVariantProps } from '#styled-system/recipes'
import { type Assign, type JsxStyleProps } from '#styled-system/types'
import { Switch as ArkSwitch, type SwitchRootProps } from '@ark-ui/react/switch'
import { type ReactNode } from 'react'

export interface SwitchProps extends Assign<JsxStyleProps, SwitchRootProps>, SwitchRecipeVariantProps {
  children?: ReactNode
}

export const Switch = (props: SwitchProps) => {
  const [variantProps, switchProps] = switchRecipe.splitVariantProps(props)
  const [cssProps, localProps] = splitCssProps(switchProps)
  const { css: cssProp, ...restCssProps } = cssProps
  const { children, className, ...rootProps } = localProps
  const styles = switchRecipe(variantProps)

  return (
    <ArkSwitch.Root className={cx(styles.root, css(restCssProps, cssProp), className)} {...rootProps}>
      <ArkSwitch.Control className={styles.control}>
        <ArkSwitch.Thumb className={styles.thumb} />
      </ArkSwitch.Control>
      {children && <ArkSwitch.Label className={styles.label}>{children}</ArkSwitch.Label>}
    </ArkSwitch.Root>
  )
}

// Switch.displayName = 'Switch'
