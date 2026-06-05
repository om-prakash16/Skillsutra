import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@blockchain/wallet-adapter-base',
    '@blockchain/wallet-adapter-react',
    '@blockchain/wallet-adapter-react-ui',
    '@blockchain/web3.js',
    '@noble/curves',
    '@noble/hashes'
  ],
  serverExternalPackages: ['pino-pretty', 'lokijs', 'encoding'],
  async rewrites() {
    return [
      {
        source: '/api/auth/callback/github',
        destination: '/auth/callback/github',
      },
    ];
  },
};

export default nextConfig;
