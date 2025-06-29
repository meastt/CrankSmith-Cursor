/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'cdn.shopify.com',
      'www.jensonusa.com',
      'www.competitivecyclist.com',
      'm.media-amazon.com'
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async redirects() {
    return [
      {
        source: '/gear-calculator',
        destination: '/calculators/gear-comparison',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 