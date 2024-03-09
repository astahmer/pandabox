import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { LuChevronLeft } from 'react-icons/lu'
import { IconButton } from '../components/icon-button'
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
    <Layout
      header={
        <Link to="/">
          <IconButton title="Home" css={{ fontSize: 'md' }}>
            <LuChevronLeft />
          </IconButton>
        </Link>
      }
    >
      <Playground />
    </Layout>
  )
}
