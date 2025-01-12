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
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    }
    return config
  }
}

export default nextConfig
