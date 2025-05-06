// src/app/layout.tsx
import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import PageThemeToggle from './components/pageThemeToggle';

export const metadata = {
  title: 'Ruler 디자인 시스템',
  description: '29CM의 디자인 원칙을 반영한 컴포넌트/토큰 문서',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <header className="border-b py-4 px-6 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Ruler</Link>
            <nav className="space-x-4 text-sm">
              <Link href="/components">컴포넌트</Link>
              <Link href="/tokens">디자인 토큰</Link>
              <a href="https://www.figma.com/" target="_blank">Figma</a>
            </nav>
            <PageThemeToggle />
          </header>
          
          <main className="px-6 py-10">{children}</main>
          
          <footer className="border-t text-center text-xs text-gray-500 py-4">
            © 2025 29CM. All rights reserved.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}