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
import { SiTailwindcss } from 'react-icons/si'
import { hstack } from '#styled-system/patterns'

interface LayoutProps extends PropsWithChildren {
  header?: ReactNode
}

const link = css({
  _dark: { color: 'yellow.300' },
  _hover: { color: 'blue.400' },
})

const Header = (
  <div className={hstack({ gap: 1 })}>
    <Link className={link} to="/">
      🐼 pandabox
    </Link>
    <span>-</span>
    <Link className={link} to="/styled2panda">
      styled2panda
    </Link>
  </div>
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
                <IconButton
                  title="Twitter"
                  css={{
                    colorPalette: 'blue',
                    color: { base: 'colorPalette.500', _dark: 'colorPalette.200' },
                  }}
                >
                  <TwitterIcon />
                </IconButton>
              </a>
              <a target="blank" href="https://tw2panda-astahmer.vercel.app/">
                <IconButton
                  title="tw2panda"
                  css={{
                    px: '2',
                    w: 'auto',
                    colorPalette: 'sky',
                    color: { base: 'sky.500', _dark: 'sky.200' },
                    borderWidth: '1px',
                    borderColor: { base: 'sky.500/25', _hover: 'transparent' },
                  }}
                >
                  <div className={hstack()}>
                    <SiTailwindcss />
                    <span>tw2panda</span>
                  </div>
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
