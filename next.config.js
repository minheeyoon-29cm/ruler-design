const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'd13fzx7h5ezopb.cloudfront.net',
      'img.29cm.co.kr',
      'raw.githubusercontent.com'
    ],
  },
};

module.exports = withContentlayer(nextConfig);