import { config } from './theme-preset'

config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
config.defineStyles({
  color: 'red !important',
  border: '1px solid token(colors.red.100)',
  bg: 'blue.300',
  textStyle: '2xl',
  width: [1, 2, undefined, null, 3],
  fontSize: {
    base: 'xs',
    sm: 'sm',
    _hover: {
      base: 'md',
      md: 'lg',
      _focus: 'xl',
    },
    _dark: '2xl',
  },
  sm: {
    color: 'yellow',
    backgroundColor: {
      base: 'red',
      _hover: 'green',
    },
  },
  "&[data-attr='test']": {
    color: 'green',
    _expanded: {
      color: 'purple',
      '.target &': {
        color: {
          base: 'cyan',
          _open: 'orange',
          xl: 'pink',
        },
      },
    },
  },
})

config.defineRecipe({
  className: 'aaa',
  base: {
    display: 'flex',
    background: 'text',
  },
  variants: {
    type: {
      success: {
        bg: 'rose.200',
        background: 'tex.',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
})
