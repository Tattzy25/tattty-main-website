/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Remove experimental features that might be causing issues
  experimental: {
    optimizeCss: false,
    scrollRestoration: true,
  }
}

export default nextConfig
