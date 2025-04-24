// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


// next.config.mjs
import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,      
  swcMinify: true,            
};

export default withPWA({
  dest: "public",         
  register: true,         
  skipWaiting: true,  
})(nextConfig);