/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Correct blob domain and subpath
  assetPrefix: "https://mghzzpn2s9ixrl0b.public.blob.vercel-storage.com/product",

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // ✅ Image loader setup for Blob + future static domain
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "mghzzpn2s9ixrl0b.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "static.bakesalevibes.com" } // future optional vanity domain
    ],
  },

  // ✅ Standalone output for Vercel optimization
  output: "standalone",

  // ✅ Simple debug helper (safe to keep)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      console.log("🔧 Using asset prefix:", config.output.publicPath);
    }
    return config;
  },
};

module.exports = nextConfig;
