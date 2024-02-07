import { css, cx } from '#styled-system/css'
import { SystemStyleObject } from '#styled-system/types'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  css?: SystemStyleObject
}

export function IconButton(props: IconButtonProps) {
  const { children, className, css: cssProp, ...rest } = props
  return (
    <button
      {...rest}
      className={cx(
        className,
        css(
          {
            transition: 'colors',
            transitionDuration: '100ms',
            colorPalette: 'gray',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            w: '40px',
            h: '40px',
            borderRadius: 'md',
            bg: { base: 'gray.100', _dark: 'gray.700' },
            _hover: {
              bg: 'colorPalette.400',
              color: 'white',
              _dark: {
                bg: 'colorPalette.600',
              },
            },
          },
          cssProp,
        ),
      )}
    >
      {children}
    </button>
  )
}
