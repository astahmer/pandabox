import { css } from '../styled-system/css'
import { HStack, Stack } from '../styled-system/jsx'
import { BadgeVariantProps, avatar, badge, button } from '../styled-system/recipes'
import '@fontsource/press-start-2p'

interface BadgeProps extends Pick<BadgeVariantProps, 'variant'> {
  text: string
  text2?: string
  icon?: string
}

const getVariants = (props: BadgeProps) => {
  const { text2, icon, variant } = props
  const variants: BadgeVariantProps = { isIcon: Boolean(icon), isSplited: Boolean(text2), variant }

  if (!variants.isIcon) {
    delete variants.isIcon
  }
  if (!variants.isSplited) {
    delete variants.isSplited
  }

  return variants
}

const Badge = (props: BadgeProps) => {
  const { text, text2, icon } = props
  const classes = badge(getVariants(props))

  return (
    <div className={classes.root}>
      <span className={classes.text}>{text}</span>
      {text2 && <span className={classes.text2}>{text2}</span>}
      {icon && <span className={classes.icon}>{icon}</span>}
    </div>
  )
}

function App() {
  return (
    <div className={css({ fontFamily: 'PressStart2P' })}>
      <Stack p="4">
        <HStack>
          <span>Avatar</span>
          <div className={avatar({ size: 'lg' })}>Hello</div>
        </HStack>
        <HStack>
          <span>Badge</span>
          <Badge text="Hello" />
          <Badge text="Left" text2="Right" />
          <Badge text="With Icon" icon="🐼" />
        </HStack>
        <HStack>
          <span>Button</span>
          <div className={button({ variant: 'default' })}>Default</div>
          <div className={button({ variant: 'success' })}>Success</div>
          <div className={button({ variant: 'primary' })}>Primary</div>
          <div className={button({ variant: 'warning' })}>Warning</div>
          <div className={button({ variant: 'error' })}>Error</div>
          <div data-disabled className={button({})}>
            Disabled
          </div>
        </HStack>
      </Stack>
    </div>
  )
}

export default App
