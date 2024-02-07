import { Center, Stack, styled } from '#styled-system/jsx'
import type { MetaFunction } from '@remix-run/node'
import { Layout } from '../components/layout'
import { css, cx } from '#styled-system/css'
import { LuExternalLink, LuLink } from 'react-icons/lu'
import { hstack } from '#styled-system/patterns'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [{ title: 'Pandabox' }, { name: 'description', content: '@pandabox / a toolbox for Panda CSS' }]
}

const link = cx(
  'group',
  hstack({
    _hover: { color: { _dark: 'blue.300', _light: 'blue.500' } },
  }),
)
const linkTitle = css({
  _light: { color: 'blue.500', _groupHover: { color: 'blue.700' } },
  _dark: { color: 'blue.400' },
  _groupHover: { color: { _dark: 'blue.100' } },
})

export default function Index() {
  return (
    <Layout>
      <Center h="100%">
        <Stack p="8" textAlign="center">
          <styled.h1 textStyle={{ base: '4xl', md: '7xl' }} fontWeight="bold" color="yellow.400">
            @pandabox
          </styled.h1>
          <styled.h1 textStyle={{ base: '3xl', md: '4xl' }} color={{ base: 'gray.500', _dark: 'gray.300' }}>
            a toolbox for 🐼 Panda CSS
          </styled.h1>
          <Stack gap="1" mt="4" textStyle={{ base: 'sm', md: 'lg' }}>
            <Link className={link} to="/styled2panda">
              <LuLink /> <span className={linkTitle}>styled2panda</span> Easily migrate code from `styled-components` to
              Panda CSS
            </Link>
            <a className={link} href="https://tw2panda-astahmer.vercel.app/" target="_blank">
              <LuExternalLink /> <span className={linkTitle}>tw2panda</span> : Easily migrate code from tailwind to
              Panda CSS
            </a>
            <a className={link} href="https://github.com/astahmer/pandabox/tree/main/packages/utils">
              <LuExternalLink />
              <span className={linkTitle}>assignInlineVars</span> Override tokens/semanticTokens CSS vars at runtime
              with a type-safe function
            </a>
            <a className={link} href="https://github.com/astahmer/pandabox/tree/main/packages/define-theme">
              <LuExternalLink />
              <span className={linkTitle}>defineTheme</span> End to end type-safe theme definition
            </a>
            <a
              className={link}
              href="https://github.com/astahmer/pandabox/tree/main/packages/define-recipe"
              target="_blank"
            >
              <LuExternalLink /> <span className={linkTitle}>defineRecipe</span> Extend, pick, omit and merge config
              Recipes/Slots Recipes to easily compose them together.
            </a>
          </Stack>
        </Stack>
      </Center>
    </Layout>
  )
}
