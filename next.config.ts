import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "media.w3.org" },
      { protocol: "https", hostname: "test-videos.co.uk" },
    ],
  },
};

export default nextConfig;
