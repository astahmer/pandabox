import { Flex, HStack, Stack } from '#styled-system/jsx'
import type { PropsWithChildren, ReactNode } from 'react'
import { useEffect } from 'react'

import { css } from '#styled-system/css'
import { hstack } from '#styled-system/patterns'
import { Link } from '@remix-run/react'
import { SiTailwindcss } from 'react-icons/si'
import { ThemeProvider } from '../vite-themes/provider'
import { ColorModeSwitch } from './color-mode-switch'
import { GithubIcon } from './github-icon'
import { IconButton } from './icon-button'
import { TwitterIcon } from './twitter-icon'

interface LayoutProps extends PropsWithChildren {
  header?: ReactNode
}

const isDev = import.meta.env.DEV

export const Layout = ({ children, header }: LayoutProps) => {
  useEffect(() => {
    if (isDev) return
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://umami-nu-bice.vercel.app/script.js'
    script.dataset.websiteId = 'bc74b9b7-777d-4f2d-8c55-a6e27259207c'
    document.body.appendChild(script)
  }, [])

  return (
    <ThemeProvider>
      <Flex
        w="100%"
        maxW="100vw"
        h="100vh"
        maxH="100vh"
        color="text.main"
        bg={{ base: 'white/6', _dark: 'white/8' }}
        fontFamily="Inter"
      >
        <Stack w="100%" h="100%">
          <Flex pt="2" p="3" _light={{ bg: 'gray.100' }}>
            {header}
            <HStack alignItems="center" ml="auto">
              <a target="blank" href="https://www.astahmer.dev/">
                <IconButton title="Alex's website">
                  <img
                    src="/favicon.png"
                    alt="Alex's logo which is a mix of 2 emojis: Panda and Nerd face"
                    width="28"
                    height="28"
                  />
                </IconButton>
              </a>
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
                    <span className={css({ hideBelow: 'md' })}>tw2panda</span>
                  </div>
                </IconButton>
              </a>
              <Link to="/styled2panda">
                <IconButton
                  title="tw2panda"
                  css={{
                    px: '2',
                    w: 'auto',
                    colorPalette: 'purple',
                    backgroundColor: 'colorPalette.200/70',
                    borderWidth: '1px',
                    borderColor: { base: 'purple.300/25', _hover: 'transparent' },
                  }}
                >
                  <div className={hstack()}>
                    💅
                    <span className={css({ hideBelow: 'md' })}>styled2panda</span>
                  </div>
                </IconButton>
              </Link>
              <ColorModeSwitch />
            </HStack>
          </Flex>
          {children}
        </Stack>
      </Flex>
    </ThemeProvider>
  )
}
