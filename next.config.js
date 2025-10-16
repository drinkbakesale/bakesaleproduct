/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Do NOT use assetPrefix — it breaks JS/CSS and _next/static loading
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

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

  env: {
    // 🚫 Prevents Vercel’s Design Mode overlay assets (like /images/design-mode/*)
    NEXT_DISABLE_VERCEL_DESIGN_MODE: "true",
  },

  experimental: {
    // small DX improvement, harmless in prod
    typedRoutes: true,
  },

  output: "standalone",
}

module.exports = nextConfig
