'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { allComponents, allFoundations } from 'contentlayer/generated';
import { StatusBadge, type Status } from './StatusBadge';

function normalizeStatus(status: string): Status {
  switch (status) {
    case 'draft':
    case 'review':
    case 'active':
    case 'deprecated':
      return status;
    default:
      return 'draft';
  }
}

export default function Sidebar() {
  const pathname = usePathname();

  const sortedFoundations = allFoundations.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return (
    <nav className="w-64 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
      <ul className="space-y-2 text-sm">
 

        {/* Foundation 섹션 */}
        <li>
          <details open>
            <summary className="cursor-pointer px-2 py-1 font-semibold text-gray-700 dark:text-gray-300">
              Foundation
            </summary>
            <ul className="mt-1 space-y-1 pl-4">
              <li>
                <Link
                  href="/foundation"
                  className={`block px-2 py-1 rounded ${
                    pathname === '/foundation' ? 'font-semibold text-blue-600' : 'hover:text-blue-600'
                  }`}
                >
                  Overview
                </Link>
              </li>
              {sortedFoundations.map((foundation) => (
                <li key={foundation.slug}>
                  <Link
                    href={`/foundation/${foundation.slug}`}
                    className={`block px-2 py-1 rounded ${
                      pathname === `/foundation/${foundation.slug}` ? 'font-semibold text-blue-600' : 'hover:text-blue-600'
                    }`}
                  >
                    {foundation.title}
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

        {/* Roadmap 섹션 */}
        <li>
          <a
            href="https://jira.team.musinsa.com/jira/software/c/projects/M29CMPROD/boards/1337"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-2 py-1 rounded hover:text-blue-600"
          >
            <span>Roadmap</span>
            <span className="text-xs">↗</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
