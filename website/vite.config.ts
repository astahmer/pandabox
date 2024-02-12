import { unstable_vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import panda from '@pandabox/unplugin-panda-macro/vite'

installGlobals()

export default defineConfig({
  plugins: [
    panda(),
    remix({
      unstable_ssr: false,
    }),
  ],
  resolve: {
    conditions: ['source'],
  },
})
