/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // ✅ Force all asset URLs to point to product domain
  assetPrefix:
    process.env.NODE_ENV === "production"
      ? "https://product.bakesalevibes.com"
      : undefined,

  // ✅ Disable Vercel Design Mode everywhere
  env: {
    NEXT_DISABLE_VERCEL_DESIGN_MODE: "true",
  },

  // 🚫 Block any route containing "design-mode"
  async redirects() {
    return [
      {
        source: "/:path*/design-mode/:rest*",
        destination: "/404",
        permanent: false,
      },
    ];
  },

  // 🚫 Add headers to prevent caching or indexing of any design-mode assets
  async headers() {
    return [
      {
        source: "/:path*/design-mode/:rest*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },

  // ✅ Allow only blob-hosted images from your storage
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

  // ✅ Output as a standalone deployment
  output: "standalone",
};

module.exports = nextConfig;
