/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  webpack: (config,) => {
        config.resolve.alias = {
          ...config.resolve.alias,
          "monaco-editor": "@monaco-editor/react",
        };
        return config;

  }
};

module.exports = nextConfig;
