import type { Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { Project, SourceFile } from 'ts-morph'
import { EventObject, assign, setup } from 'xstate'
import { urlSaver } from './url-saver'
import { templateLiteralToObjectSyntax } from '@pandabox/codemods/template-to-object-syntax'
import initialInput from './initial-input?raw'

const project = new Project({
  useInMemoryFileSystem: true,
})
const createSourceFile = (content: string) => project.createSourceFile('app.tsx', content, { overwrite: true })

export const playgroundActor = setup({
  types: {
    context: {} as {
      monaco: Monaco | null
      inputEditor: editor.IStandaloneCodeEditor | null
      outputEditor: editor.IStandaloneCodeEditor | null
      sourceFile: SourceFile | null
      input: string
      output: string
      options: {
        withClassName: boolean
        matchTag: string | null
      }
    },
    events: {} as
      | {
          type: 'Editor Loaded'
          editor: editor.IStandaloneCodeEditor
          monaco: Monaco
          kind: 'input' | 'output'
        }
      | { type: 'Save' }
      | { type: 'Set withClassName'; value: boolean }
      | { type: 'Set matchTag'; value: string }
      | { type: 'Set input'; value: string },
  },
  actions: {
    assignEditorRef: assign(({ context, event }) => {
      assertEvent(event, 'Editor Loaded')

      if (event.kind === 'input') {
        return { ...context, inputEditor: event.editor, monaco: event.monaco }
      }

      return { ...context, outputEditor: event.editor, monaco: event.monaco }
    }),
    setInput: assign(({ context, event }) => {
      if (event.type !== 'Set input') return context
      assertEvent(event, 'Set input')

      return { ...context, input: event.value }
    }),
    setOutput: assign(({ context }) => {
      const input = context.input ?? ''
      if (!input) return context

      const matchTag = context.options.matchTag
      const transformed = templateLiteralToObjectSyntax({
        sourceFile: createSourceFile(input),
        matchTag: matchTag ? (tag) => tag.includes(matchTag) : undefined,
        flags: {
          withClassName: context.options.withClassName,
        },
      })

      return {
        ...context,
        output: transformed.code,
      }
    }),
    setUrl({ context }) {
      urlSaver.setValue('input', context.input ?? '')
    },
    setClassName: assign(({ context, event }) => {
      assertEvent(event, 'Set withClassName')
      return { ...context, options: { ...context.options, withClassName: event.value } }
    }),
    setMatchTag: assign(({ context, event }) => {
      assertEvent(event, 'Set matchTag')
      return { ...context, options: { ...context.options, matchTag: event.value } }
    }),
  },
  guards: {
    willBeReady: ({ context }) => {
      return Boolean(context.inputEditor || context.outputEditor)
    },
  },
}).createMachine({
  context: {
    monaco: null,
    inputEditor: null,
    outputEditor: null,
    sourceFile: null,
    input: initialInput,
    output: '',
    options: {
      withClassName: true,
      matchTag: null,
    },
  },
  initial: 'loading',
  states: {
    loading: {
      on: {
        'Editor Loaded': [
          { guard: 'willBeReady', target: 'ready', actions: ['assignEditorRef'] },
          { actions: 'assignEditorRef' },
        ],
      },
    },
    ready: {
      initial: 'Playing',
      entry: ['setOutput'],
      states: {
        Playing: {
          on: {
            Save: { actions: ['setUrl'] },
            'Set input': { actions: ['setInput', 'setUrl', 'setOutput'] },
            'Set withClassName': { actions: ['setClassName', 'setOutput'] },
            'Set matchTag': { actions: ['setMatchTag', 'setOutput'] },
          },
        },
      },
    },
  },
})

function assertEvent<TEvent extends EventObject, Type extends TEvent['type']>(
  ev: TEvent,
  type: Type,
): asserts ev is Extract<TEvent, { type: Type }> {
  if (ev.type !== type) {
    throw new Error('Unexpected event type.')
  }
}
