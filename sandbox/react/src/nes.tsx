import '@fontsource/press-start-2p'
import React, { ReactNode } from 'react'
import { css, cva, cx } from '../styled-system/css'
import { HStack, Stack } from '../styled-system/jsx'
import { SectionVariantProps, avatar, badge, balloon, button, section } from '../styled-system/recipes'
import { ComponentProps, RecipeVariant } from '../styled-system/types'

type BadgeVariantProps = RecipeVariant<typeof badgeVariant>
interface BadgeProps extends ComponentProps<'span'>, Partial<Pick<BadgeVariantProps, 'variant'>> {}

const BadgeText = (props: BadgeProps) => {
  const { variant, children, className, ...rest } = props
  return (
    <span {...rest} className={cx('badge-text', badgeVariant({ variant }), className)}>
      {children}
    </span>
  )
}
const BadgeText2 = (props: BadgeProps) => {
  const { variant, children, className, ...rest } = props
  return (
    <span {...rest} className={cx('badge-text badge-text2', badgeVariant({ variant }), className)}>
      {children}
    </span>
  )
}
const BadgeIcon = (props: BadgeProps) => {
  const { variant, children, className, ...rest } = props
  return (
    <span {...rest} className={cx('badge-icon', badgeVariant({ variant }), className)}>
      {children}
    </span>
  )
}

const badgeVariant = cva({
  variants: {
    variant: {
      primary: {
        '--badge-bg': '{colors.nes.variants.primary}',
      },
      success: {
        '--badge-bg': '{colors.nes.variants.success}',
      },
      warning: {
        '--badge-color': '{colors.nes.base}',
        '--badge-bg': '{colors.nes.variants.warning}',
      },
      error: {
        '--badge-bg': '{colors.nes.variants.error}',
      },
    },
  },
})

const Badge = (props: BadgeProps & { icon?: ReactNode }) => {
  const { variant, icon, children } = props
  const isSplited = React.Children.count(children) > 1 ? true : undefined

  return (
    <div className={cx(badge({ isSplited }), badgeVariant({ variant }))}>
      {children}
      {icon}
    </div>
  )
}

interface SectionProps extends ComponentProps<'section'> {
  variant?: SectionVariantProps['variant']
  rounded?: boolean
}

const Section = (props: SectionProps) => {
  const { variant, rounded, title, children, ...rest } = props
  return (
    <section
      {...rest}
      data-rounded={Boolean(rounded) ? true : undefined}
      data-with-title={Boolean(title) ? true : undefined}
      className={section({ variant })}
    >
      <span className="nes-section-title">{title}</span>
      {children}
    </section>
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
          <Badge>
            <BadgeText>Hello</BadgeText>
          </Badge>
          <Badge variant="warning">
            <BadgeText>Hello</BadgeText>
          </Badge>
          <Badge>
            <BadgeText variant="primary">Hello</BadgeText>
          </Badge>
          <Badge>
            <BadgeText>Left</BadgeText>
            <BadgeText2 variant="success">Right</BadgeText2>
          </Badge>
          <Badge icon={<BadgeIcon>🐼</BadgeIcon>}>
            <BadgeText>Hello</BadgeText>
          </Badge>
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
        <HStack>
          <span>Balloon</span>
          <div className={balloon()}>Default</div>
          <div data-from="left" className={balloon()}>
            fromLeft
          </div>
          <div data-from="right" className={balloon()}>
            fromRight
          </div>
          <div className={balloon({ variant: 'dark' })}>dark</div>
          <div data-from="left" className={balloon({ variant: 'dark' })}>
            dark fromLeft
          </div>
          <div data-from="right" className={balloon({ variant: 'dark' })}>
            dark fromRight
          </div>
        </HStack>
        <HStack>
          <span>Section</span>
          <div className={section()}>Default</div>
          <Section title="Title">content</Section>
          <Section title="Title" rounded>
            content
          </Section>
          <div className={section({ variant: 'dark' })}>dark</div>
          <Section title="Title" variant="dark">
            content
          </Section>
          <Section title="Title" variant="dark" rounded>
            rounded
          </Section>
        </HStack>
      </Stack>
    </div>
  )
}

export default App
