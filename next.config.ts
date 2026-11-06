import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // cacheComponents: true,
  // partialPrefetching: true,

  async redirects() {
    return [
      {
        source: "/residences",
        destination: "/hostels",
        permanent: true,
      },
      {
        source: "/residences/:slug*",
        destination: "/hostels/:slug*",
        permanent: true,
      },
      {
        source: "/managed-residences",
        destination: "/managed-hostels",
        permanent: true,
      },
      {
        source: "/managed-residences/:slug*",
        destination: "/managed-hostels/:slug*",
        permanent: true,
      },
      {
        source: "/student-residences",
        destination: "/student-hostels",
        permanent: true,
      },
      {
        source: "/student-residences/:slug*",
        destination: "/student-hostels/:slug*",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/blogs",
        permanent: true,
      },
      {
        source: "/blog/:slug*",
        destination: "/blogs/:slug*",
        permanent: true,
      },
      {
        source: "/stories",
        destination: "/real-stories",
        permanent: true,
      },
      {
        source: "/stories/:slug*",
        destination: "/real-stories/:slug*",
        permanent: true,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apnapackertestingbucket.s3.ap-south-1.amazonaws.com",
        pathname: "/images/**",
      },
    ],
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
