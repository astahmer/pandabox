import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import panda from '../src/vite'

export default defineConfig({
  plugins: [Inspect(), panda({ output: 'grouped', outfile: './panda.css' })],
})
