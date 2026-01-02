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
  // Turbopack configuration
  // Note: Turbopack has built-in filesystem caching, so no additional caching config needed
  turbopack: {
    resolveAlias: {
      // Add any module aliases here if needed
    },
  },

  // Reduce overhead during development
  experimental: {
    // Only compile pages when they are accessed
    optimizePackageImports: ['@tanstack/react-query', '@trpc/client', '@trpc/react-query'],
  },
};

export default config;
