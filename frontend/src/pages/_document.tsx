import { Html, Head, Main, NextScript } from 'next/document'

/**
 * Custom Document Component
 * 
 * This component customizes the HTML document structure.
 * It only runs on the server side and is used to modify <html> and <body> tags.
 * 
 * For teams new to Next.js:
 * - Use this for adding custom fonts, meta tags, scripts
 * - This does NOT run on every request (only during build)
 * - Do NOT add application logic here
 */

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add custom fonts, meta tags, or external scripts here */}
        <meta name="description" content="Clinical Laboratory Management Application" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
