/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Point all static assets to the actual deployment domain
  assetPrefix: "https://product.bakesalevibes.com",

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    unoptimized: true,
  },

  // ✅ Standalone output for Vercel
  output: "standalone",
}

module.exports = nextConfig
