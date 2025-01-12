/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    disableStaticImages: false,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  experimental: {
    esmExternals: 'loose',
  }
}

export default nextConfig
