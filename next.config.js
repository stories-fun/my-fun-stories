/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["pub-61076b0159ee4fdab7efe9dadc68458d.r2.dev", 'img.youtube.com'],
  },
};

export default config;
