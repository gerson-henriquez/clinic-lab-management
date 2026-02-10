import { Html, Head, Main, NextScript } from 'next/document'

/**
 * Custom Document – Neumorphic Precision
 * HTML structure with font preloads and theme initialization
 */
export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/images/logo_icon.png" />
        <link rel="apple-touch-icon" href="/images/logo_icon.png" />
        
        {/* JetBrains Mono for console/mono text */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
              rel="stylesheet" />
        
        {/* Meta */}
        <meta name="description" content="Sistema de Gestión de Laboratorio Clínico" />
        <meta name="theme-color" content="#059669" />
        
        {/* Prevent FOUC – Apply theme before React hydrates */}
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
