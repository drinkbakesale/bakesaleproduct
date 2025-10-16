/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mghzzpn2s9ixrl0b.public.blob.vercel-storage.com",
        pathname: "/product/images/**"
      }
    ]
  },
  output: "standalone"
}

module.exports = nextConfig
