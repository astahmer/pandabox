import { unstable_vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import panda from '@pandabox/unplugin-panda-macro/vite'

installGlobals()

export default defineConfig({
  plugins: [
    Inspect(),
    panda({ output: 'atomic' }),
    remix({
      unstable_ssr: false,
    }),
  ],
  resolve: {
    conditions: ['source'],
  },
})
