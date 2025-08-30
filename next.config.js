/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@solana/web3.js'],
  },
  images: {
    domains: ['localhost', 'vercel.blob.core.windows.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
