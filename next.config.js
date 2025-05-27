const { withContentlayer } = require('next-contentlayer');

const nextConfig = {
  reactStrictMode: true,
  // trailingSlash: true, // ← 제거 (Vercel은 자동 처리)
  // output: 'export', // ← 제거 (정적 export 아님)
  // basePath: `/${repoName}`, // ← 제거 (Vercel이 자동 처리)
  // assetPrefix: `/${repoName}`, // ← 제거 (Vercel이 자동 처리)
  
  images: {
    unoptimized: true, // ← 유지 (contentlayer 때문에)
    domains: [
      'd13fzx7h5ezopb.cloudfront.net',
      'img.29cm.co.kr', 
      'raw.githubusercontent.com',
      'cdn.figma.com',
    ],
  },
};

module.exports = withContentlayer(nextConfig);