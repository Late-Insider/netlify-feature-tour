/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["blob.v0.app"],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
