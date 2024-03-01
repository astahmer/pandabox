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
      <Stack mt={{ sm: '8' }} gap="6" h="100%" pt="8">
        <Stack gap="6" alignItems="center">
          <styled.h1 textStyle="3xl" fontWeight="bold" color="sky.500">
            @pandabox
          </styled.h1>
          <styled.h1 textStyle="xl" color={{ base: 'gray.500', _dark: 'gray.300' }}>
            a toolbox for 🐼 Panda CSS
          </styled.h1>
        </Stack>
        <Grid columns={{ base: 1, sm: 2, md: 3 }} css={container.raw()} gap="4" mt="4" textStyle="md">
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
            title="@pandabox/unplugin-panda-macro"
            description="Make your `styled-system` disappear at build-time by inlining the results as class names."
            href="https://github.com/astahmer/pandabox/tree/main/packages/unplugin-panda-macro"
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
      display="flex"
      href={href}
      borderRadius="lg"
      p={{ base: '4', md: '6' }}
      direction={{ base: 'column', md: 'row' }}
      gap={{ base: '5', md: '6' }}
      justify="space-between"
      minH="initial"
      css={{
        transition: 'colors',
        transitionDuration: '100ms',
        colorPalette: 'gray',
        bg: { base: 'gray.100', _dark: 'gray.700' },
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
        <styled.span fontSize="xs" color="muted">
          {description}
        </styled.span>
      </Stack>
      <styled.div hideBelow="md" fontSize="sm">
        <LuExternalLink />
      </styled.div>
    </Stack>
  )
}
