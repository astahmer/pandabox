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
    },
    events: {} as
      | {
          type: 'Editor Loaded'
          editor: editor.IStandaloneCodeEditor
          monaco: Monaco
          kind: 'input' | 'output'
        }
      | { type: 'Save' }
      | { type: 'Update input'; value: string },
  },
  actions: {
    assignEditorRef: assign(({ context, event }) => {
      assertEvent(event, 'Editor Loaded')

      if (event.kind === 'input') {
        return { ...context, inputEditor: event.editor, monaco: event.monaco }
      }

      return { ...context, outputEditor: event.editor, monaco: event.monaco }
    }),
    updateInput: assign(({ context, event }) => {
      if (event.type !== 'Update input') return context
      assertEvent(event, 'Update input')

      return { ...context, input: event.value }
    }),
    updateOutput: assign(({ context }) => {
      const input = context.input ?? ''
      if (!input) return context

      const transformed = templateLiteralToObjectSyntax({ sourceFile: createSourceFile(input) })

      return {
        ...context,
        output: transformed.code,
      }
    }),
    updateUrl({ context }) {
      urlSaver.setValue('input', context.input ?? '')
    },
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
      entry: ['updateOutput'],
      states: {
        Playing: {
          on: {
            Save: { actions: ['updateUrl'] },
            'Update input': { actions: ['updateInput', 'updateUrl', 'updateOutput'] },
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
