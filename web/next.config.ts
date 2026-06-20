import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  output: "standalone",
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  transpilePackages: [
    '@blockchain/wallet-adapter-base',
    '@blockchain/wallet-adapter-react',
    '@blockchain/wallet-adapter-react-ui',
    '@blockchain/web3.js',
    '@noble/curves',
    '@noble/hashes'
  ],
  serverExternalPackages: ['pino-pretty', 'lokijs', 'encoding'],
  async redirects() {
    return [
      {
        source: '/api/auth/callback/github',
        destination: '/auth/callback/github',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const backendUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
    // Remove trailing slash if present
    const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    
    return [
      {
        source: '/api/v1/:path*',
        destination: `${cleanBackendUrl}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http: http://localhost:* blob:; connect-src 'self' ws: wss: https: http://localhost:* http://127.0.0.1:*; frame-src 'self' https:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
