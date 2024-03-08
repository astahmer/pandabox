import { createVitePlugin } from 'unplugin'
import { unpluginFactory } from './plugin/core'

export default createVitePlugin(unpluginFactory)
