import type { MetaFunction } from '@remix-run/node'
import { Layout } from '../components/layout'
import { Playground } from '../playground/playground'

export const meta: MetaFunction = () => {
  return [
    { title: 'styled2panda' },
    { name: 'description', content: 'Template literal to Object syntax with Panda CSS' },
  ]
}

export default function Index() {
  return (
    <Layout>
      <Playground />
    </Layout>
  )
}
