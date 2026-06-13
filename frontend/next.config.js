/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'django-authentication-1-m4u1.onrender.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
      },
    ],
  },
}

module.exports = nextConfig
