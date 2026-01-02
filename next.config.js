/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// Only validate env in production builds, skip in dev for faster startup
if (process.env.NODE_ENV === 'production' || process.env.npm_lifecycle_event === 'build') {
  await import("./src/env.js");
}

/** @type {import("next").NextConfig} */
const config = {
  // Turbopack optimizations
  turbopack: {
    // Reduce initial compilation time
    resolveAlias: {
      // Skip unnecessary polyfills
      canvas: false,
    },
  },

  // Optimize webpack caching (fallback when not using turbopack)
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Enable persistent caching in development
      config.cache = {
        type: 'filesystem',
        compression: false, // Faster on macOS
      };
    }
    return config;
  },

  // Reduce overhead during development
  experimental: {
    // Only compile pages when they are accessed
    optimizePackageImports: ['@tanstack/react-query', '@trpc/client', '@trpc/react-query'],
  },
};

export default config;
