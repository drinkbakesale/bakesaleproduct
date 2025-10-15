/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "https://static.bakesalevibes.com",

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "static.bakesalevibes.com" },
      { protocol: "https", hostname: "blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },

  webpack: (config) => {
    config.output.publicPath = "https://static.bakesalevibes.com/_next/";
    return config;
  },

  output: "standalone",
};

module.exports = nextConfig;
