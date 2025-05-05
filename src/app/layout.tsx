// src/app/layout.tsx
'use client';

import React from 'react';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <title>Ruler 디자인 시스템</title>
        <meta name="description" content="29CM Ruler 디자인 시스템 문서" />
      </head>
      <body>
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Ruler 디자인 시스템
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/components" className="hover:text-blue-600 transition-colors">
                    컴포넌트
                  </Link>
                </li>
                <li>
                  <Link href="/tokens" className="hover:text-blue-600 transition-colors">
                    디자인 토큰
                  </Link>
                </li>
                <li>
                  <a href="https://www.figma.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                    Figma
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main>
          {children}
        </main>
        
        <footer className="bg-gray-100 mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-600">© 2025 29CM. All rights reserved.</p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  GitHub
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Storybook
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Figma
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}