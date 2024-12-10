/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      webgpu: false,
    };

    config.externals = [...config.externals, "onnxruntime-web"];

    return config;
  },

  // Disable server-side rendering for problematic components
  reactStrictMode: false,

  // Optional: transpile specific packages
  transpilePackages: ["@imgly/background-removal", "onnxruntime-web"],
};

module.exports = nextConfig;
