import unplugin from '.'
import type { PandaPluginOptions } from './plugin/core'

export default (options: PandaPluginOptions) => ({
  name: 'unplugin-starter',
  hooks: {
    'astro:config:setup': async (astro: any) => {
      astro.config.vite.plugins ||= []
      astro.config.vite.plugins.push(unplugin.vite(options))
    },
  },
})
