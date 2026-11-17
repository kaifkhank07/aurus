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
      // {
      //   source: "/residences/:slug+",
      //   destination: "/hostel-details/:slug+",
      //   permanent: true,
      // },
      // {
      //   source: "/hostels/:slug+",
      //   destination: "/hostel-details/:slug+",
      //   permanent: true,
      // },
      // Old hostel page addresses from the previous website
      { source: "/hostel-details/chapter-1", destination: "/hostel-details/chapter-i", permanent: true },
      { source: "/hostel-details/chapter-2", destination: "/hostel-details/chapter-ii", permanent: true },
      { source: "/hostel-details/chapter-3", destination: "/hostel-details/chapter-iii", permanent: true },
      { source: "/hostel-details/chapter-4-luxury-residences-for-boys", destination: "/hostel-details/chapter-iv", permanent: true },
      { source: "/hostel-details/chapter-5-luxury-residences-for-boys", destination: "/hostel-details/chapter-v", permanent: true },
      { source: "/hostel-details/chapter-5-luxury-residences-for-boys-girls", destination: "/hostel-details/chapter-v", permanent: true },
      { source: "/hostel-details/chapter-6-luxury-residences-for-boys", destination: "/hostel-details/chapter-vi", permanent: true },
      { source: "/hostel-details/chapter-vi-luxury-residences-for-boys", destination: "/hostel-details/chapter-vi", permanent: true },
      { source: "/hostel-details/chapter-7-residences-for-girls", destination: "/hostel-details/chapter-vii", permanent: true },
      { source: "/hostel-details/chapter-7-residences-for-Girls", destination: "/hostel-details/chapter-vii", permanent: true },
      { source: "/hostel-details/chapter-8-residences-for-boys-girls", destination: "/hostel-details/chapter-viii", permanent: true },
      { source: "/hostel-details/chapter-9-residences-for-boys-girls", destination: "/hostel-details/chapter-ix", permanent: true },
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
        source: "/blog/:slug+",
        destination: "/blog-details/:slug+",
        permanent: true,
      },
      {
        source: "/blogs/:slug+",
        destination: "/blog-details/:slug+",
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
        // Images carried over from the previous website, served from /public/uploads
        protocol: "https",
        hostname: "www.auruslife.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "aurus-website.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "apnapackertestingbucket.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
        pathname: "/**",
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
