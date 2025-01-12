/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this if you're using static exports
  output: 'standalone',
  
  // Make sure images are configured properly
  images: {
    domains: ['hjhpjfwfsnacxjynfstr.supabase.co'],
    unoptimized: true
  }
}

module.exports = nextConfig 