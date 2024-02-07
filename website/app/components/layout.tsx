import '@fontsource/inter'

import { Flex, HStack, Stack } from '#styled-system/jsx'
import { PropsWithChildren, ReactNode } from 'react'

import { ColorModeSwitch } from './color-mode-switch'
import { GithubIcon } from './github-icon'
import { IconButton } from './icon-button'
import { TwitterIcon } from './twitter-icon'
import { ThemeProvider } from '../vite-themes/provider'
import { Link } from '@remix-run/react'
import { css } from '#styled-system/css'

interface LayoutProps extends PropsWithChildren {
  header?: ReactNode
}

const Header = (
  <HStack>
    <Link className={css({ _hover: { color: 'blue.400' } })} to="/">
      @pandabox
    </Link>
    <span>-</span>
    <Link className={css({ _hover: { color: 'blue.400' } })} to="/template-literal-to-object-syntax">
      Template literal to Object syntax
    </Link>
  </HStack>
)

export const Layout = ({ children, header }: LayoutProps) => {
  return (
    <ThemeProvider>
      <Flex
        w="100%"
        h="100vh"
        maxH="100vh"
        color="text.main"
        bg={{ base: 'whiteAlpha.100', _dark: 'whiteAlpha.200' }}
        fontFamily="Inter"
      >
        <Stack w="100%" h="100%">
          <Flex pt="2" p="3" _light={{ bg: 'gray.100' }}>
            {header || Header}
            <HStack alignItems="center" ml="auto">
              <a target="blank" href="https://github.com/astahmer/pandabox">
                <IconButton title="Github">
                  <GithubIcon />
                </IconButton>
              </a>
              <a target="blank" href="https://twitter.com/astahmer_dev">
                <IconButton title="Twitter" css={{ color: { base: 'colorPalette.500', _dark: 'colorPalette.200' } }}>
                  <TwitterIcon />
                </IconButton>
              </a>
              <ColorModeSwitch />
            </HStack>
          </Flex>
          {children}
        </Stack>
      </Flex>
    </ThemeProvider>
  )
}
