import 'virtual:panda.css'
import { cva } from '../styled-system/css'

const atomicRecipe = cva({
  base: {
    display: 'flex',
  },
  variants: {
    visual: {
      solid: { bg: 'red.200', color: 'white' },
      outline: { borderWidth: '1px', borderColor: 'red.200' },
    },
    size: {
      sm: { padding: '4', fontSize: '12px' },
      lg: { padding: '8', fontSize: '24px' },
    },
  },
  compoundVariants: [
    {
      visual: 'outline',
      size: 'lg',
      css: {
        borderWidth: '3px',
      },
    },
  ],
  defaultVariants: {
    visual: 'solid',
  },
})

export const App = () => {
  return <div className={atomicRecipe({ visual: 'solid', size: 'sm' })}>Atomic Button</div>
}
