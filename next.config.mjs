/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    disableStaticImages: false,
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
      },
      alias: {
        ...config.resolve.alias,
        '@': './src',
      },
    }
    return config
  },
  experimental: {
    esmExternals: 'loose',
  }
}

export default nextConfig
