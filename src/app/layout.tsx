// src/app/layout.tsx
import '../styles/globals.css';
import Link from 'next/link';
import { ThemeProvider } from 'next-themes';
import PageThemeToggle from './components/pageThemeToggle';
import Head from 'next/head';

export const metadata = {
  title: 'Ruler 디자인 시스템',
  description: '29CM의 디자인 원칙을 반영한 컴포넌트/토큰 문서',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <Head>
        <link rel="icon" href="/favicon/favicon.ico" />
        <title>Ruler 디자인 시스템</title>
        <meta name="description" content="29CM의 디자인 원칙을 반영한 컴포넌트/토큰 문서" />
      </Head>
      <body>
        <ThemeProvider attribute="class">
          <header className="header">
            {/* 좌측 로고 */}
            <Link href="/"  className='logo'>
              {/* 라이트 모드 로고 */}
              <img
                src="/ruler_logotype_light.svg"
                alt="Ruler Logo"
              />
              {/* 다크 모드 로고 (반전된 로고가 있는 경우 사용) */}
              <img
                src="/ruler_logotype_dark.svg"
                alt="Ruler Logo Dark"
                 />
            </Link>
            {/* 우측 테마 토글 */}
            <PageThemeToggle />
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
