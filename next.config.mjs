import withPWA from './next-pwa.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APPLICATION_NAME: process.env.NEXT_PUBLIC_APPLICATION_NAME,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true,      // Enable SWC minification for improved performance
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
};

export default withPWA(nextConfig);
