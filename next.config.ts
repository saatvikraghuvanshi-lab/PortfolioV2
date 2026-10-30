import type { NextConfig } from "next";

/**
 * Static export so the same build runs on Vercel and Cloudflare Pages
 * with no platform-specific adapter.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
