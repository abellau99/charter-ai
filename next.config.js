/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const isDev = process.env.APP_ENV === "development";
    let rewrites = [];

    if (isDev) {
      rewrites.push({
        source: "/.netlify/functions/create-content-background",
        destination:
          "http://localhost:8888/.netlify/functions/create-content-background", // Replace with your Netlify Dev server URL
      });
    }
    return rewrites;
  },
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "media.tenor.com",
      },
      {
        protocol: "https",
        hostname: "s3.eu-west-2.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
