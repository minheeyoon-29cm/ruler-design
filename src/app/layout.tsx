// src/app/layout.tsx
import '../styles/globals.css';
import '../styles/layout.css';
import '@29cm/ruler-ui/style.css';
import Link from 'next/link';
import { ThemeProvider } from 'next-themes';
import PageThemeToggle from './components/pageThemeToggle';
import Sidebar from '../components/docs/Sidebar';

// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div>
            {/* 고정 상단 헤더 */}
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
            
            {/* 고정 사이드바 - main-wrapper 밖으로 빼기 */}
            <Sidebar />
            
            {/* 메인 콘텐츠만 wrapper에 넣기 */}
            <div className="main-wrapper">
              <main className="main-content">
                <div className="container-wrapper">
                  {children}
                </div>
              </main>

            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
