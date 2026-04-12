/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    tsconfigPath: './tsconfig.next.json',
  },
  async redirects() {
    return [
      { source: '/index', destination: '/', permanent: true },
    ]
  },
}

export default nextConfig
