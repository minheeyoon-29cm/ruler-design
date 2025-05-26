const { withContentlayer } = require('next-contentlayer');

const isNetlify = process.env.NETLIFY === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: isNetlify,            // Netlify는 trailing slash 필요
  output: isNetlify ? 'export' : undefined, // Netlify만 static export
  images: {
    unoptimized: isNetlify,            // next/image 비활성화 for Netlify
    domains: [
      'd13fzx7h5ezopb.cloudfront.net',
      'img.29cm.co.kr',
      'raw.githubusercontent.com',
      'cdn.figma.com',
    ],
  },
};

module.exports = withContentlayer(nextConfig);
