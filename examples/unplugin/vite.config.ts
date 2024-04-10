import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import react from '@vitejs/plugin-react-swc'
import pandabox from '@pandabox/unplugin'

export default defineConfig({
  plugins: [
    Inspect(),
    pandabox.vite({
      outfile: './src/panda.css',
    }),
    react(),
  ],
})
