/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  images: { unoptimized: true },
  output: "export",
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
  experimental: { webpackBuildWorker: false },
};

export default nextConfig;
