import { parentPort } from 'worker_threads'
import { createContext, type PandaPluginContext } from './plugin/create-context'
import { loadConfig } from '@pandacss/config'
import { throttle } from 'es-toolkit'

// TODO: make the worker file in the plugin, don't make consumer import this themselves
type Message =
  | {
      type: 'init'
      cwd: string
      configPath: string
    }
  | {
      type: 'transform'
      code: string
      id: string
      cwd: string
      configPath: string
    }

export const setupWorker = () => {
  let _ctx: PandaPluginContext
  let initPromise: Promise<PandaPluginContext> | undefined
  parentPort?.on('message', async (message: Message) => {
    if (message.type === 'init') {
      await init({ cwd: message.cwd, configPath: message.configPath })
    } else if (message.type === 'transform') {
      const start = performance.now();
      const { id, code } = message
      // When promise init is done, _ctx will be set
      await initPromise;
      const ctx = _ctx;
      if (!ctx) return null
      const { panda } = ctx
      panda.project.addSourceFile(id, code)
      // simulate parsing that takes much longer than other transforms
      // for(let i = 0; i < 4; i++) {
      //   panda.project.parseSourceFile(id)

      // }
      const parserResult = panda.project.parseSourceFile(id)
      if (!parserResult?.isEmpty()) {
        ctx.files.set(id, code)
        sendCss(ctx, id)
      }
      // console.log('transform', performance.now() - start)
    }
  })
  const sendCss = throttle(
    async (ctx: any, id) => {
      console.log('sending css')
      // TODO: optimize and minify
      const css = await ctx.toCss(ctx.panda.createSheet(), { optimizeCss: false, minifyCss: false })
      parentPort?.postMessage({ type: 'setCss', css })
    },
    1000,
    { edges: ['leading', 'trailing'] },
  )
  const init = ({ cwd, configPath }: { cwd: string; configPath: string }) => {
    if (initPromise) return initPromise

    // console.log('loadConfig', options)
    // @ts-expect-error
    initPromise = loadConfig({ cwd, file: configPath }).then(async (conf: LoadConfigResult) => {
      conf.config.cwd = cwd
      _ctx = createContext({ root: cwd, conf })
    })

    return initPromise
  }
}
