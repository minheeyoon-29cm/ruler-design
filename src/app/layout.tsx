// src/app/layout.tsx
import '../styles/globals.css';
import '../styles/layout.css';
import Link from 'next/link';
import { ThemeProvider } from 'next-themes';
import PageThemeToggle from './components/pageThemeToggle';
import Sidebar from '../components/docs/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div>
          {/* 상단 헤더 */}
            <header className="header">
              <Link href="/" className="logo">
                <img
                  src="/ruler_logotype_light.svg"
                  alt="Ruler Logo"
                  className="dark:hidden"
                />
                <img
                  src="/ruler_logotype_dark.svg"
                  alt="Ruler Logo Dark"
                  className="hidden dark:block"
                />
              </Link>
              <PageThemeToggle />
            </header>
            {/* 아래 영역: 사이드바 + 메인 */}
            <div className="flex">
              <Sidebar />
              <main className="container">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
