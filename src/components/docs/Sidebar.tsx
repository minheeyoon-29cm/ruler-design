'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { allComponents } from 'contentlayer/generated';
import { StatusBadge } from './StatusBadge';


function normalizeStatus(status: string): 'draft' | 'review' | 'active' | 'deprecated' | 'hold' {
  switch (status) {
    case 'beta':
      return 'review';
    case 'draft':
    case 'review':
    case 'active':
    case 'deprecated':
    case 'hold':
      return status;
    default:
      return 'draft';
  }
}

/**
 * 사이드바 메뉴 컴포넌트.
 *
 * - Roadmap은 외부 컨플루언스 링크로 연결합니다.
 * - Foundation 섹션에서는 디자인 토큰 개요와 컬러·타이포·스페이싱 등의 세부 항목을 제공합니다.
 * - Component 섹션에서는 MDX 기반 컴포넌트 목록을 자동으로 나열하고 상태 뱃지를 표시합니다.
 */
export default function Sidebar() {
  const pathname = usePathname();

  const foundationItems = [
    { title: '컬러', slug: 'colors' },
    { title: '타이포', slug: 'typography' },
    { title: '스페이싱', slug: 'spacing' },
  ];

  return (
    <nav className="w-64 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
      <ul className="space-y-2 text-sm">
        {/* 로드맵은 외부 페이지로 */}
        <li>
          <a
            href="https://confluence.example.com/ruler/roadmap"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-2 py-1 rounded hover:text-blue-600"
          >
            <span>Roadmap</span>
            <span className="text-xs">↗</span>
          </a>
        </li>

        {/* Foundation 섹션 */}
        <li>
          <details open>
            <summary className="cursor-pointer px-2 py-1 font-semibold text-gray-700 dark:text-gray-300">
              Foundation
            </summary>
            <ul className="mt-1 space-y-1 pl-4">
              {/* 디자인 토큰 개요 페이지 */}
    
              {/* 세부 항목 */}
              {foundationItems.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/foundation/${item.slug}`}
                    className={`block px-2 py-1 rounded ${
                      pathname === `/foundation/${item.slug}` ? 'font-semibold text-blue-600' : 'hover:text-blue-600'
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </li>

        {/* Component 섹션 */}
        <li>
          <details open>
            <summary className="cursor-pointer px-2 py-1 font-semibold text-gray-700 dark:text-gray-300">
              Component
            </summary>
            <ul className="mt-1 space-y-1 pl-4">
              <li>
                <Link
                  href="/components"
                  className={`block px-2 py-1 rounded ${
                    pathname === '/components' ? 'font-semibold text-blue-600' : 'hover:text-blue-600'
                  }`}
                >
                  Overview
                </Link>
              </li>
              {allComponents.map((component) => (
                <li key={component.slug} className="flex items-center justify-between">
                  <Link
                    href={`/components/${component.slug}`}
                    className={`flex-1 px-2 py-1 rounded ${
                      pathname === `/components/${component.slug}`
                        ? 'font-semibold text-blue-600'
                        : 'hover:text-blue-600'
                    }`}
                  >
                    {component.title}
                  </Link>
                  <StatusBadge status={normalizeStatus(component.status)} />
                </li>
              ))}
            </ul>
          </details>
        </li>
      </ul>
    </nav>
  );
}
