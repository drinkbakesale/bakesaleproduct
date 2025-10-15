/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Point Next.js static assets and public folder to Blob CDN
  assetPrefix: "https://static.bakesalevibes.com/product",

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    unoptimized: true, // Required for external CDN without optimization loader
    remotePatterns: [
      // ✅ Allow the main static domain
      { protocol: "https", hostname: "static.bakesalevibes.com" },
      // ✅ Allow Vercel Blob public and internal patterns (for backwards compatibility)
      { protocol: "https", hostname: "blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },

  // ❌ Remove custom publicPath override — assetPrefix handles this automatically
  // ✅ Keep standalone output for Vercel optimization
  output: "standalone",

  // Optional: helpful debug output if needed
  webpack: (config, { isServer }) => {
    if (!isServer) {
      console.log("🔧 Using asset prefix:", config.output.publicPath);
    }
    return config;
  },
};

module.exports = nextConfig;
