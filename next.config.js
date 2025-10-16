/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "https://mghzzpn2s9ixrl0b.public.blob.vercel-storage.com/product",
  images: {
    unoptimized: true,
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "standalone"
};

module.exports = nextConfig;
