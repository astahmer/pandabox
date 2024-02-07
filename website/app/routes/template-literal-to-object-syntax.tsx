import type { MetaFunction } from '@remix-run/node'
import { Layout } from '../components/layout'
import { Playground } from '../playground/playground'
import { styled } from '#styled-system/jsx'

export const meta: MetaFunction = () => {
  return [
    { title: 'Template literal to Object syntax' },
    { name: 'description', content: '@pandabox / a toolbox for Panda CSS' },
  ]
}

export default function Index() {
  return (
    <Layout>
      <Playground />
    </Layout>
  )
}
