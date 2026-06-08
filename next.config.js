/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
    ],
  },
}

module.exports = nextConfig
