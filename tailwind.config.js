/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',     
    './src/app/**/*.{js,ts,jsx,tsx}',     
    './src/components/**/*.{js,ts,jsx,tsx}', 
    './src/content/**/*.mdx',           // ← 수정: .{mdx} → .mdx
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};