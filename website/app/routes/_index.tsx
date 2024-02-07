import { Center, Stack, styled } from '#styled-system/jsx'
import type { MetaFunction } from '@remix-run/node'
import { Layout } from '../components/layout'
import { css } from '#styled-system/css'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [{ title: 'Pandabox' }, { name: 'description', content: '@pandabox / a toolbox for Panda CSS' }]
}

export default function Index() {
  return (
    <Layout>
      <Center h="100%">
        <Stack>
          <styled.h1 textStyle="7xl" fontWeight="bold" color="yellow.400">
            @pandabox
          </styled.h1>
          <styled.h1 textStyle="4xl" color={{ base: 'gray.500', _dark: 'gray.300' }}>
            a toolbox for Panda CSS
          </styled.h1>
          <Stack gap="1" mt="4">
            <a
              className={css({ _hover: { color: 'blue.400' } })}
              href="https://github.com/astahmer/pandabox/tree/main/packages/define-theme"
            >
              - `defineTheme`: End to end type-safe theme definition
            </a>
            <a
              className={css({ _hover: { color: 'blue.400' } })}
              href="https://github.com/astahmer/pandabox/tree/main/packages/define-recipe"
              target="_blank"
            >
              - `defineRecipe`: Extend, pick, omit and merge config Recipes/Slots Recipes to easily compose them
              together.
            </a>
          </Stack>
        </Stack>
      </Center>
    </Layout>
  )
}
