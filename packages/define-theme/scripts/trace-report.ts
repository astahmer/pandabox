// @ts-ignore
import _simple from '../trace-dir/simple.json'
// @ts-ignore
import _types from '../trace-dir/types.json'
// @ts-ignore
import _trace from '../trace-dir/trace.json'
import { readFileSync } from 'node:fs'
import { SourceText } from './source-text'

const simple = _simple as SimpleItem[]
const types = _types as TypeItem[]
const trace = _trace as TraceItem[]

const withCount = simple.filter((x) => x.count).map((x) => x.count) as number[]
const maxCount = Math.max(...withCount)

const typesById = new Map(types.map((x) => [x.id, x]))
const findRoot = (id: number) => {
  let current = typesById.get(id)
  if (!current) return

  const stack = [current]

  while (stack.length && current?.recursionId) {
    current = typesById.get(current.recursionId)
    if (current) {
      stack.push(current)
    }
  }

  return { ...current, stack, names: stack.map((x) => [x.id, x.display || x.flags.join('|')]) }
}

const mostInstanciated = simple
  // .filter((x) => x.count === maxCount)
  .filter((x) => (x.count ?? 0) >= 50)
  .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
  .slice(0, 10)
  .map((x) => {
    return {
      //   ...x,
      id: x.id,
      kind: x.kind,
      count: x.count,
      //   types: x.types?.map((x) => typesById.get(x)?.display ?? x).join(' | '),
      //   refs: types.filter((y) => y.unionTypes?.includes(x.id)).map((y) => y.display ?? x),
      //   refs: types.filter((y) => y.recursionId === x.id).map((y) => y.display ?? y.id),
      //   refs: types.filter((y) => y.recursionId === x.id).map((y) => JSON.stringify(findRoot(y.id)?.names)),
    }
  })

console.log(mostInstanciated)

const sortedTrace = trace.filter((x) => x.cat.includes('check')).sort((a, b) => (b.dur || 0) - (a.dur || 0))
const textByPath = new Map<string, SourceText>()
const format = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

const longestTraceItems = sortedTrace.slice(0, 10).map((item) => {
  const { name, dur = 0 } = item
  const { path = '', pos } = item.args || {}

  let source = textByPath.get(path)
  if (path && !textByPath.has(path)) {
    const text = readFileSync(path, 'utf8')
    source = new SourceText(text)
    textByPath.set(path, source)
  }

  const loc = source?.getLineAndColumnAtPos(pos || 0)
  const filepath = `${path}:${(loc?.line ?? 0) + 1}:${loc?.column}`

  //   console.log(`${format.format(dur / 1000)}ms ${name}, Pos: ${pos} in ${filepath}`)
  return {
    dur: format.format(dur / 1000),
    name,
    pos,
    path: filepath,
  }
})
console.table(longestTraceItems, ['dur', 'name', 'pos', 'path'])

interface Args {
  name?: string
  configFilePath?: string
  path?: string
  containingFileName?: string
  fileName?: string
  fileIncludeKind?: string
  count?: number
  isDefaultLib?: boolean
  resolveFrom?: string
  sourceId?: number
  targetId?: number
  kind?: number
  pos?: number
  end?: number
}
interface TraceItem {
  name: string
  args?: Args
  cat: string
  ph: string
  ts: number
  pid: number
  tid: number
  dur?: number
}

//

interface Start {
  line: number
  character: number
}
interface FirstDeclaration {
  path: string
  start: Start
  end: Start
}
interface TypeItem {
  id: number
  intrinsicName?: string
  recursionId?: number
  flags: string[]
  display?: string
  unionTypes?: number[]
  symbolName?: string
  firstDeclaration?: FirstDeclaration
  instantiatedType?: number
  typeArguments?: number[]
  intersectionTypes?: number[]
  keyofType?: number
  substitutionBaseType?: number
  constraintType?: number
  conditionalCheckType?: number
  conditionalExtendsType?: number
  conditionalTrueType?: number
  conditionalFalseType?: number
  aliasTypeArguments?: number[]
  referenceLocation?: FirstDeclaration
  indexedAccessObjectType?: number
  indexedAccessIndexType?: number
  isTuple?: boolean
  reverseMappedSourceType?: number
  reverseMappedMappedType?: number
  reverseMappedConstraintType?: number
}

//
interface Location {
  path: string
  line: number
  char: number
}
interface SimpleItem {
  id: number
  kind: string
  name?: string
  unionTypes?: number[]
  count?: number
  types?: number[]
  display?: string
  value?: string
  location?: Location
  typeArguments?: number[]
  instantiatedType?: number
  keyofType?: number
  originalType?: number
  constraintType?: number
  conditionalCheckType?: number
  conditionalExtendsType?: number
  aliasTypeArguments?: number[]
  conditionalTrueType?: number
  conditionalFalseType?: number
  indexedAccessObjectType?: number
  indexedAccessIndexType?: number
  sourceType?: number
  mappedType?: number
}
