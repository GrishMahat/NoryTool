/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  webpack: (config, { isServer }) => {
    // Existing fallback config
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Add externals configuration for onnxruntime-web
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "onnxruntime-web": false, // Changed from require.resolve
      };
    }

    // Add WASM support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Add rule for WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    return config;
  },
};

export default nextConfig;
