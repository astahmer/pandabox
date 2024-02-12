import { createUnplugin } from 'unplugin'
import { unpluginFactory } from './plugin/core'

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
