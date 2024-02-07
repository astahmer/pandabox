// import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import pandaCss from '../styled-system/styles.css?url'

// export const links: LinksFunction = () => [...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : [])]
export const links: LinksFunction = () => [{ rel: 'stylesheet', href: pandaCss }]

const isDev = import.meta.env.DEV

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {!isDev && (
          <script
            async
            src="https://umami-nu-bice.vercel.app/script.js"
            data-website-id="bc74b9b7-777d-4f2d-8c55-a6e27259207c"
          ></script>
        )}
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
