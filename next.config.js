/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // ✅ Force all asset URLs to point to product domain
  assetPrefix:
    process.env.NODE_ENV === "production"
      ? "https://product.bakesalevibes.com"
      : undefined,

  // ✅ Explicitly disable Vercel Design Mode at build and runtime
  env: {
    NEXT_DISABLE_VERCEL_DESIGN_MODE: "true",
  },

  // ✅ Allow direct blob image access
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
