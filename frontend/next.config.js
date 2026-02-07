/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variables exposed to browser (public)
  // These start with NEXT_PUBLIC_ prefix
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  
  // Image optimization configuration
  images: {
    domains: ['localhost'],
    // Add your production domain here when deploying
  },
  
  // Rewrites for API proxy (optional - useful for avoiding CORS in dev)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`,
      },
    ];
  },
  
  // Webpack configuration (if needed)
  webpack: (config, { isServer }) => {
    // Custom webpack configs can go here
    return config;
  },
}

module.exports = nextConfig
