import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import { vercelPreset } from '@vercel/remix/vite'
import Inspect from 'vite-plugin-inspect'
import { remixDevTools } from 'remix-development-tools/vite'
// import panda from '@pandabox/unplugin-panda-macro/vite'

installGlobals()

export default defineConfig({
  plugins: [
    Inspect(),
    // panda({ output: 'atomic' }),
    remixDevTools(),
    remix({ presets: [vercelPreset()] }),
  ],
})
