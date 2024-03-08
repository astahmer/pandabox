import { createRollupPlugin } from 'unplugin'
import { unpluginFactory } from './plugin/core'

export default createRollupPlugin(unpluginFactory)
