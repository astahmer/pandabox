import { defineConfig } from '@solidjs/start/config'
import pandabox from '@pandabox/unplugin'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  //   middleware: './src/middleware.ts',
  //   server: {
  //     preset: 'cloudflare-module',
  //   },
  vite: {
    plugins: [
      pandabox.vite({
        optimizeCss: !isDev,
      }),
    ],
  },
})
