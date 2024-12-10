/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-web': '@imgly/background-removal/dist/onnxruntime-web.js',
    };
    return config;
  },
};

module.exports = nextConfig; 