/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',     // ← 유지
    './src/app/**/*.{js,ts,jsx,tsx}',     // ← 추가: Next 13 app 디렉토리
    './src/components/**/*.{js,ts,jsx,tsx}', // ← 추가: UI 컴포넌트들
    './src/content/**/*.{mdx}',           // ← 추가: MDX 기반 문서
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
