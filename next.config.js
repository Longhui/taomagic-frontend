/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
      },
      {
        protocol: 'https',
        hostname: '**.medusa-commerce.com',
      },
      {
        protocol: 'https',
        hostname: 'medusa-public-images.s3.eu-west-1.amazonaws.com',
      },
      // 远程 Medusa 后端
      {
        protocol: 'https',
        hostname: 'medusa.rao123.top',
      },
    ],
  },
}

module.exports = nextConfig
