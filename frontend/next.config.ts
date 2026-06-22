import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/tailor",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/tailor/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
