import { defineRecipe, defineSlotRecipe, defineStyles, defineTextStyles, type Preset } from '@pandacss/dev'
import type { TextStyle, Token } from '@pandacss/types'

const avatar = defineRecipe({
  className: 'nes-avatar',
  base: {
    '--avatar-size-param': '2px',
    '--avatar-size': 'calc(var(--avatar-size-param) * 16)',
    width: 'var(--avatar-size)',
    height: 'var(--avatar-size)',
  },
  variants: {
    size: {
      xs: { '--avatar-size-param': '1px' },
      sm: { '--avatar-size-param': '2px' },
      md: { '--avatar-size-param': '3px' },
      lg: { '--avatar-size-param': '4px' },
    },
    isRounded: {
      true: {
        borderRadius: '50px',
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

const badge = defineSlotRecipe({
  className: 'nes-badge',
  slots: ['root', 'text', 'text2', 'icon'],
  base: {
    root: {
      position: 'relative',
      display: 'inline-block',
      width: '10.5rem',
      height: '1.875rem',
      margin: '0.5rem',
      fontSize: '0.9rem',
      whiteSpace: 'nowrap',
      verticalAlign: 'top',
      userSelect: 'none',
      //
      '--badge-bg': '{colors.nes.base}',
      '--badge-color': '{colors.nes.background}',
      '--badge-shadow-1': '0 0.5em var(--badge-bg), 0 -0.5em var(--badge-bg)',
      '--badge-shadow': 'var(--badge-shadow-1), 0.5em 0 var(--badge-bg), -0.5em 0 var(--badge-bg)',
      //
    },
    text: {
      position: 'absolute',
      top: '0',
      width: '100%',
      color: 'nes.white',
      textAlign: 'center',
      backgroundColor: 'var(--badge-bg)',
      boxShadow: 'var(--badge-shadow)',
    },
  },
  variants: {
    variant: {
      primary: {
        root: {
          '--badge-color': '{colors.nes.variants.primary}',
        },
      },
      success: {
        root: {
          '--badge-color': '{colors.nes.variants.success}',
        },
      },
      warning: {
        root: {
          '--badge-bg': '{colors.nes.base}',
          '--badge-text': '{colors.nes.variants.warning}',
        },
      },
      error: {
        root: {
          '--badge-color': '{colors.nes.variants.error}',
        },
      },
    },
    isSplited: {
      true: {
        text: {
          position: 'absolute',
          top: '0',
          width: '50%',
          color: 'nes.white',
          textAlign: 'center',
          backgroundColor: 'nes.black',
          left: '0',
          '--badge-shadow': 'var(--badge-shadow-1), 0 0 var(--badge-bg), -0.5em 0 var(--badge-bg)',
          boxShadow: 'var(--badge-shadow)',
        },
        text2: {
          position: 'absolute',
          top: '0',
          width: '50%',
          color: 'white',
          textAlign: 'center',
          backgroundColor: 'nes.black',
          '--badge-shadow': 'var(--badge-shadow-1), 0.5em 0 var(--badge-bg), 0 0 var(--badge-bg)',
          boxShadow: 'var(--badge-shadow)',
        },
      },
    },
    isIcon: {
      true: {
        root: {
          width: '5.25rem',
        },
        icon: {
          '--badge-shadow': 'var(--badge-shadow-1), 0.5em 0 var(--badge-bg), -0.5em 0 var(--badge-bg)',
          position: 'absolute',
          top: '-2.8rem',
          left: '-2.7rem',
          height: '2.7rem',
          //
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2.7rem',
          fontSize: '0.5rem',
          color: 'nes.white',
          textAlign: 'center',
          backgroundColor: 'nes.black',
          boxShadow: 'var(--badge-shadow)',
        },
        text: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2.7rem',
          fontSize: '0.5rem',
          color: 'nes.white',
          textAlign: 'center',
          backgroundColor: 'nes.black',
          boxShadow: 'var(--badge-shadow)',
        },
      },
    },
  },
})

const roundedCorners = ({ isDark, isCompact }: { isDark?: boolean; isCompact?: boolean }) => {
  return defineStyles({
    borderStyle: 'solid',
    borderWidth: 'nes',
    borderImageSlice: isCompact ? '2' : '3',
    borderImageWidth: isCompact ? '2' : '3',
    borderImageRepeat: 'stretch',
    borderImageSource: isCompact ? '{assets.compactBorderImage}' : '{assets.borderImage}',
    borderImageOutset: isDark ? '0' : '2',
    color: isDark ? 'nes.white' : 'nes.black',
  })
}

const balloon = defineRecipe({
  className: 'nes-balloon',
  base: {
    position: 'relative',
    display: 'inline-block',
    padding: '1rem 1.5rem',
    margin: '8px',
    marginBottom: '30px',
    backgroundColor: 'nes.background',
    '--after-shadow-color': 'nes.base',
    '--after-shadow-left': '-4px 0, 4px 0, -4px 4px var(--after-shadow-color), 0 4px, -8px 4px, -4px 8px, -8px 8px',
    '& > :last-child': {
      marginBottom: '0',
    },
    '&::before, &::after': {
      position: 'absolute',
      content: '""',
    },
  },
  variants: {
    variant: {
      dark: {
        ...roundedCorners({ isDark: true, isCompact: false }),
        color: 'nes.background',
        backgroundColor: 'nes.base',
        borderImageOutset: '2',
        boxShadow: '0 0 0 8px {colors.nes.base}',
        '&:before': {
          backgroundColor: 'nes.base',
          borderColor: 'nes.background',
        },
        '&:after': {
          color: 'nes.background',
          backgroundColor: 'nes.base',
        },
        '--before-shadow-left': '-5px 10px 0 6px {colors.nes.base}',
        '--before-shadow-right': '5px 10px 0 6px {colors.nes.base}',
        '--after-shadow-left': '-4px 0, 4px 0, -4px 4px {colors.nes.base}, 0 4px, -8px 4px, -4px 8px, -8px 8px',
        '--after-shadow-right': '-4px 0, 4px 0, 4px 4px {colors.nes.base}, 0 4px, 8px 4px, 4px 8px, 8px 8px',
      },
    },
    position: {
      fromLeft: {
        '&::before, &::after': {
          left: '2rem',
        },
        '&:before': {
          bottom: '-14px',
          width: '26px',
          height: '10px',
          backgroundColor: 'nes.background',
          borderRight: '4px solid {colors.nes.base}',
          borderLeft: '4px solid {colors.nes.base}',
        },
        '&:after': {
          bottom: '-18px',
          width: '18px',
          height: '4px',
          marginRight: '8px',
          color: 'nes.base',
          backgroundColor: 'nes.background',
          boxShadow: '-4px 0, 4px 0, -4px 4px {colors.nes.background}, 0 4px, -8px 4px, -4px 8px, -8px 8px',
        },
      },
      fromRight: {
        '&::before, &::after': {
          right: '2rem',
        },
        '&:before': {
          bottom: '-14px',
          width: '26px',
          height: '10px',
          backgroundColor: 'nes.background',
          borderRight: '4px solid {colors.nes.base}',
          borderLeft: '4px solid {colors.nes.base}',
        },
        '&:after': {
          bottom: '-18px',
          width: '18px',
          height: '4px',
          marginLeft: '8px',
          backgroundColor: 'nes.background',
          boxShadow: '-4px 0, 4px 0, 4px 4px {colors.nes.background}, 0 4px, 8px 4px, 4px 8px, 8px 8px',
        },
      },
    },
  },
})

const button = defineRecipe({
  className: 'nes-btn',
  base: {
    ...roundedCorners({ isCompact: true }),
    position: 'relative',
    display: 'inline-block',
    padding: '6px 8px',
    margin: '{borderWidths.nes}',
    textAlign: 'center',
    verticalAlign: 'middle',
    cursor: '{assets.cursor}, pointer',
    userSelect: 'none',
    //
    boxShadowColor: 'colorPalette.shadow',
    color: 'var(--text-color)',
    backgroundColor: 'colorPalette',
    //
    _after: {
      position: 'absolute',
      top: 'calc(-1 * {borderWidths.nes})',
      right: 'calc(-1 * {borderWidths.nes})',
      bottom: 'calc(-1 * {borderWidths.nes})',
      left: 'calc(-1 * {borderWidths.nes})',
      content: '""',
      boxShadow: 'inset -4px -4px var(--shadow-color)',
    },
    _hover: {
      color: 'var(--text-color)',
      backgroundColor: 'colorPalette.hover',
      //   color: 'nes.base',
      textDecoration: 'none',
      //   backgroundColor: 'nes.hover',
      _after: {
        boxShadow: 'inset -6px -6px var(--shadow-color)',
      },
    },
    _focus: {
      //   boxShadow: '0 0 0 6px {colors.nes.variants.default.shadow/30}',
      boxShadow: '0 0 0 6px {colors.nes.variants.default.shadow}',
      outline: 'none',
    },
    _active: {
      _after: {
        boxShadow: 'inset 4px 4px var(--shadow-color)',
      },
    },
    _disabled: {
      '&, &:hover, &:focus': {
        color: 'nes.base',
        cursor: 'not-allowed',
        backgroundColor: 'nes.variants.disabled',
        boxShadowColor: 'nes.variants.disabled.shadow',
        boxShadow: 'inset -4px -4px var(--shadow-color)',
        opacity: '0.6',
      },
    },
  },
  variants: {
    variant: {
      default: {
        colorPalette: 'nes.variants.default',
        '--text-color': '{colors.nes.base}',
      },
      primary: {
        '--text-color': 'colors.nes.background',
        colorPalette: 'nes.variants.primary',
      },
      success: {
        '--text-color': 'colors.nes.background',
        colorPalette: 'nes.variants.success',
      },
      warning: {
        colorPalette: 'nes.variants.warning',
      },
      error: {
        '--text-color': 'colors.nes.background',
        colorPalette: 'nes.variants.error',
      },
    },
  },
})

export const nesCss: Preset = {
  theme: {
    extend: {
      tokens: {
        colors: {
          nes: {
            black: { value: '#212529' },
            white: { value: '#fff' },

            base: { value: '{colors.nes.black}' },
            background: { value: '{colors.nes.white}' },
            //

            variants: {
              default: {
                DEFAULT: { value: '{colors.nes.white}' },
                hover: { value: '#e7e7e7' },
                shadow: { value: '#adafbc' },
              },
              disabled: {
                DEFAULT: { value: '#d3d3d3' },
                shadow: { value: '#adafbc' },
              },
              primary: {
                DEFAULT: { value: '#209cee' },
                hover: { value: '#108de0' },
                shadow: { value: '#006bb3' },
              },
              success: {
                DEFAULT: { value: '#92cc41' },
                hover: { value: '#76c442' },
                shadow: { value: '#4aa52e' },
              },
              warning: {
                DEFAULT: { value: '#f7d51d' },
                hover: { value: '#f2c409' },
                shadow: { value: '#e59400' },
              },
              error: {
                DEFAULT: { value: '#e76e55' },
                hover: { value: '#ce372b' },
                shadow: { value: '#8c2022' },
              },
            },

            // https://en.wikipedia.org/wiki/List_of_video_game_console_palettes#NES
            rgb: {
              '00': { value: '#7c7c7c' },
              '01': { value: '#0000fc' },
              '02': { value: '#0000bc' },
              '03': { value: '#4428bc' },
              '04': { value: '#940084' },
              '05': { value: '#a80020' },
              '06': { value: '#a81000' },
              '07': { value: '#881400' },
              '08': { value: '#503000' },
              '09': { value: '#007800' },
              '0A': { value: '#006800' },
              '0B': { value: '#005800' },
              '0C': { value: '#004058' },
              '0D': { value: '#000' },
              '0E': { value: '#000' },
              '0F': { value: '#000' },

              '10': { value: '#bcbcbc' },
              '11': { value: '#0078f8' },
              '12': { value: '#0058f8' },
              '13': { value: '#6844fc' },
              '14': { value: '#d800cc' },
              '15': { value: '#e40058' },
              '16': { value: '#f83800' },
              '17': { value: '#e45c10' },
              '18': { value: '#ac7c00' },
              '19': { value: '#00b800' },
              '1A': { value: '#00a800' },
              '1B': { value: '#00a844' },
              '1C': { value: '#088' },
              '1D': { value: '#000' },
              '1E': { value: '#000' },
              '1F': { value: '#000' },

              '20': { value: '#f8f8f8' },
              '21': { value: '#3cbcfc' },
              '22': { value: '#6888fc' },
              '23': { value: '#9878f8' },
              '24': { value: '#f878f8' },
              '25': { value: '#f85898' },
              '26': { value: '#f87858' },
              '27': { value: '#fca044' },
              '28': { value: '#f8b800' },
              '29': { value: '#b8f818' },
              '2A': { value: '#58d854' },
              '2B': { value: '#58f898' },
              '2C': { value: '#00e8d8' },
              '2D': { value: '#787878' },
            },
          },
        },
        fonts: {
          PressStart2P: { value: "'Press Start 2P', system-ui" },
        },
        assets: {
          cursor: { value: { type: 'url', value: '../assets/cursor.png' } },
          cursorClick: { value: { type: 'url', value: '../assets/cursor-click.png' } },
          borderImage: {
            value: {
              type: 'svg',
              value:
                '<svg version="1.1" width="8" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M3 1 h1 v1 h-1 z M4 1 h1 v1 h-1 z M2 2 h1 v1 h-1 z M5 2 h1 v1 h-1 z M1 3 h1 v1 h-1 z M6 3 h1 v1 h-1 z M1 4 h1 v1 h-1 z M6 4 h1 v1 h-1 z M2 5 h1 v1 h-1 z M5 5 h1 v1 h-1 z M3 6 h1 v1 h-1 z M4 6 h1 v1 h-1 z" fill="currentColor" /></svg>',
            },
          },
          compactBorderImage: {
            value: {
              type: 'svg',
              value:
                '<svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="currentColor" /></svg>',
            },
          },
        },
        borderWidths: {
          nes: { value: '4px' },
        },
      },
      recipes: {
        avatar,
        balloon,
        button,
      },
      slotRecipes: {
        badge,
      },
    },
  },
}
