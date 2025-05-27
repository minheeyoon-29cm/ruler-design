const { withContentlayer } = require('next-contentlayer');

const repoName = 'ruler-design';

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: 'export',
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}`,
  images: {
    unoptimized: true,
    domains: [
      'd13fzx7h5ezopb.cloudfront.net',
      'img.29cm.co.kr',
      'raw.githubusercontent.com',
      'cdn.figma.com',
    ],
  },
};

module.exports = withContentlayer(nextConfig);
