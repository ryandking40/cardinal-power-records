/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    disableStaticImages: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: []
  },
  experimental: {
    esmExternals: 'loose'
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true
}

export default nextConfig
