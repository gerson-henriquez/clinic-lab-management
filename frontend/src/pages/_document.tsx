import { Html, Head, Main, NextScript } from 'next/document'

/**
 * Custom Document Component
 * 
 * Customizes the HTML document structure
 * - Configures HTML lang attribute (Spanish)
 * - Adds global favicon
 * - Sets theme color for mobile browsers
 * - Prevents flash of unstyled content for dark mode
 */

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/images/logo_icon.png" />
        <link rel="apple-touch-icon" href="/images/logo_icon.png" />
        
        {/* Meta tags */}
        <meta name="description" content="Sistema de Gestión de Laboratorio Clínico" />
        <meta name="theme-color" content="#00C853" />
        
        {/* Prevent flash of unstyled content - Apply theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'system';
                  var resolved = theme;
                  
                  if (theme === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  
                  document.documentElement.classList.add(resolved);
                  document.documentElement.style.colorScheme = resolved;
                } catch (e) {}
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
