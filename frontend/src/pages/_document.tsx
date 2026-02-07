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
    <Html lang="es">
      <Head>
        {/* Favicon - using PNG icon without background */}
        <link rel="icon" type="image/png" href="/images/logo_icon.png" />
        <link rel="apple-touch-icon" href="/images/logo_icon.png" />
        
        {/* Meta tags */}
        <meta name="description" content="Sistema de Gestión de Laboratorio Clínico" />
        <meta name="theme-color" content="#00C853" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
