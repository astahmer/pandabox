import type { LinksFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import pandaCss from '../styled-system/styles.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pandaCss }]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
