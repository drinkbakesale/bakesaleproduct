/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ REMOVE assetPrefix - it breaks JS/CSS loading
  // assetPrefix: "https://mghzzpn2s9ixrl0b.public.blob.vercel-storage.com/product",

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "mghzzpn2s9ixrl0b.public.blob.vercel-storage.com" }],
  },

  output: "standalone",
}

module.exports = nextConfig
