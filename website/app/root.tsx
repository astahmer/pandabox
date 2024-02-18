import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import type { LinksFunction } from '@remix-run/node'
// import { cssBundleHref } from '@remix-run/css-bundle'

import pandaCss from 'virtual:panda.css?url'
// import pandaCss from '../styled-system/styles.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pandaCss }]
// export const links: LinksFunction = () => {
//   // console.log({ pandaCss })
//   return [
//     // { rel: 'stylesheet', href: pandaCss },
//     ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
//     // ...
//   ]
// }

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
