/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production"

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // ✅ Only prefix Next's own static assets, not your images
  assetPrefix: isProd ? "https://product.bakesalevibes.com/_next/" : undefined,

  // ✅ Fix URLs in the generated HTML
  basePath: "",

  images: {
    unoptimized: true,
    // Allow external blob storage
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mghzzpn2s9ixrl0b.public.blob.vercel-storage.com",
        pathname: "/product/images/**",
      },
    ],
  },

  output: "standalone",
}

module.exports = nextConfig
