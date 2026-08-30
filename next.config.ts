import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "central.theforgebrand.shop",
      },
      {
        protocol: "https",
        hostname: "theforgebrand.shop",
      },
    ],
  },
};

export default nextConfig;
