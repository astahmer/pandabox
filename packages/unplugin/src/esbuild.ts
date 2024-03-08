import { createEsbuildPlugin } from 'unplugin'
import { unpluginFactory } from './plugin/core'

export default createEsbuildPlugin(unpluginFactory)
