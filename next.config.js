/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // ✅ Force all asset URLs to point to product domain
  assetPrefix:
    process.env.NODE_ENV === "production"
      ? "https://product.bakesalevibes.com"
      : undefined,

  images: {
    unoptimized: true,
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
