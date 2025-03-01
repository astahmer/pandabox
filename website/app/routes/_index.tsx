import { Grid, Stack, styled } from '#styled-system/jsx'
import { container } from '#styled-system/patterns'
import type { HTMLStyledProps } from '#styled-system/types'
import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import type { ReactNode } from 'react'
import { LuExternalLink } from 'react-icons/lu'
import { Layout } from '../components/layout'

export const meta: MetaFunction = () => {
  return [{ title: 'Pandabox' }, { name: 'description', content: '@pandabox / a toolbox for Panda CSS' }]
}

export default function Index() {
  return (
    <Layout>
      <Stack gap="6" h="100%" mt={{ sm: '8' }} pt="8">
        <Stack gap="6" alignItems="center">
          <styled.h1 textStyle="3xl" color="sky.500" fontWeight="bold">
            @pandabox
          </styled.h1>
          <styled.h1 textStyle="xl" color={{ base: 'gray.500', _dark: 'gray.300' }}>
            a toolbox for 🐼 Panda CSS
          </styled.h1>
        </Stack>
        <Grid textStyle="md" gap="4" mt="4" columns={{ base: 1, sm: 2, md: 3 }} css={container.raw()}>
          <Card
            title="@pandabox/panda-plugins"
            description="Transforms the `styled-system` to fit your exact needs"
            href="https://github.com/astahmer/pandabox/tree/main/packages/panda-plugins"
          />
          <Card
            title="@pandabox/prettier-plugin"
            description="Prettier plugin for Panda CSS, sort `css(xxx)` and JSX style props`"
            href="https://github.com/astahmer/pandabox/tree/main/packages/prettier-plugin"
          />
          <Card
            title="@pandabox/unplugin"
            description="Make your `styled-system` disappear at build-time by inlining the results as class names."
            href="https://github.com/astahmer/pandabox/tree/main/packages/unplugin"
          />
          <Card
            title="styled2panda"
            description="Easily migrate code from `styled-components` to Panda CSS"
            to="/styled2panda"
          />
          <Card
            title="assignInlineVars"
            description="Override tokens/semanticTokens CSS vars at runtime with a type-safe function"
            href="https://github.com/astahmer/pandabox/tree/main/packages/utils"
          />
          <Card
            title="defineTheme"
            description="End to end type-safe theme definition"
            href="https://github.com/astahmer/pandabox/tree/main/packages/define-theme"
          />
          <Card
            title="defineRecipe"
            description="Extend, pick, omit and merge config Recipes/Slots Recipes to easily compose them together."
            href="https://github.com/astahmer/pandabox/tree/main/packages/define-recipe"
          />
          <Card title="Alex website" description="A collection of utilities" href="https://www.astahmer.dev" />
        </Grid>
      </Stack>
    </Layout>
  )
}

const Card = ({
  title,
  description,
  href,
  to,
}: HTMLStyledProps<'a'> & { title: string; description: ReactNode; to?: string }) => {
  const Inner = href ? 'a' : Link
  return (
    <Stack
      // @ts-expect-error
      as={Inner}
      to={to}
      href={href}
      display="flex"
      gap={{ base: '5', md: '6' }}
      direction={{ base: 'column', md: 'row' }}
      justify="space-between"
      borderRadius="lg"
      minH="initial"
      p={{ base: '4', md: '6' }}
      css={{
        colorPalette: 'gray',
        bg: { base: 'gray.100', _dark: 'gray.700' },
        transition: 'colors',
        transitionDuration: '100ms',
        _hover: {
          bg: 'colorPalette.400',
          color: 'white',
          _dark: {
            bg: 'colorPalette.600',
          },
        },
      }}
    >
      <Stack>
        <styled.span color={{ _dark: 'sky.300' }} fontSize="sm" fontWeight="semibold">
          {title}
        </styled.span>
        <styled.span color="muted" fontSize="xs">
          {description}
        </styled.span>
      </Stack>
      <styled.div hideBelow="md" fontSize="sm">
        <LuExternalLink />
      </styled.div>
    </Stack>
  )
}
