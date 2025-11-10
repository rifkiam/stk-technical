/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'localhost'
      }
    ]
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
};

export default nextConfig;
