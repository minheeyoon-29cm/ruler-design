// src/app/layout.tsx
import '../styles/globals.css';
import Link from 'next/link';
import { ThemeProvider } from 'next-themes';
import PageThemeToggle from './components/pageThemeToggle';
import Sidebar from '../components/docs/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {/* 상단 헤더 */}
          <div className="flex flex-col min-h-screen">
            <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Link href="/" className="logo flex items-center space-x-2">
                <img
                  src="/ruler_logotype_light.svg"
                  alt="Ruler Logo"
                  className="h-6 dark:hidden"
                />
                <img
                  src="/ruler_logotype_dark.svg"
                  alt="Ruler Logo Dark"
                  className="h-6 hidden dark:block"
                />
              </Link>
              <PageThemeToggle />
            </header>
            {/* 아래 영역: 사이드바 + 메인 */}
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 p-4 overflow-y-auto">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
