import { css, cx } from '#styled-system/css'
import type { SystemStyleObject } from '#styled-system/types'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  css?: SystemStyleObject
}

export function IconButton(props: IconButtonProps) {
  const { children, className, css: cssProp, ...rest } = props
  return (
    <button {...rest} className={cx(className, css(iconButton, cssProp))}>
      {children}
    </button>
  )
}

export const iconButton = css.raw({
  colorPalette: 'gray',
  display: 'flex',
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 'md',
  w: '40px',
  h: '40px',
  bg: { base: 'gray.100', _dark: 'gray.700' },
  transition: 'colors',
  transitionDuration: '100ms',
  cursor: 'pointer',
  _hover: {
    color: 'white',
    bg: 'colorPalette.400',
    _dark: {
      bg: 'colorPalette.600',
    },
  },
})
