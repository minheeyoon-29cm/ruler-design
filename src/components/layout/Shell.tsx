'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../docs/Sidebar';
import PageThemeToggle from '../../app/components/pageThemeToggle';

export default function Shell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {/* 모바일 햄버거 버튼 */}
          <button
            type="button"
            className="lg:hidden mr-2 p-2"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
          >
            <svg className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* 로고 */}
          <Link href="/" className="logo flex items-center space-x-2">
            <img src="/ruler_logotype_light.svg" alt="Ruler Logo" className="h-6 dark:hidden" />
            <img src="/ruler_logotype_dark.svg" alt="Ruler Logo Dark" className="h-6 hidden dark:block" />
          </Link>
        </div>
        <PageThemeToggle />
      </header>

      {/* 본문 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 슬라이딩 사이드바 */}
        <div
          className={`fixed inset-y-0 left-0 z-20 w-64 transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-200 lg:static lg:translate-x-0 lg:z-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar />
        </div>
        {/* 오버레이: 모바일에서 사이드바 열릴 때 */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden" onClick={toggleSidebar} />
        )}
        {/* 메인 컨텐츠 */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
