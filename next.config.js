/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  assetPrefix:
    process.env.NODE_ENV === "production"
      ? "https://product.bakesalevibes.com"
      : undefined,

  env: {
    NEXT_DISABLE_VERCEL_DESIGN_MODE: "true",
  },

  // 🚫 Block any design-mode route
  async redirects() {
    return [
      {
        source: "/:path*(design-mode)/*",
        destination: "/404",
        permanent: false,
      },
    ];
  },

  // 🚫 Disallow caching / indexing of design-mode assets
  async headers() {
    return [
      {
        source: "/:path*(design-mode)/*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
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

  output: "standalone",
}

module.exports = nextConfig
