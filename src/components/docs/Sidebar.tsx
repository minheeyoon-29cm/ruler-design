'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { allComponents, allFoundations } from 'contentlayer/generated';
import { StatusBadge, type Status } from './StatusBadge';
import "../../styles/sidebar.css";
import { ChevronIcon } from '../../../public/icon/ChevronIcon';

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
  const [isFoundationOpen, setIsFoundationOpen] = useState(true);
  const [isComponentOpen, setIsComponentOpen] = useState(true);

  const sortedFoundations = allFoundations.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  const handleFoundationToggle = () => {
    setIsFoundationOpen(!isFoundationOpen);
  };

  const handleComponentToggle = () => {
    setIsComponentOpen(!isComponentOpen);
  };

  return (
    <nav className="">
      <ul className="">
 
        {/* Foundation 섹션 */}
        <li>
          <details open={isFoundationOpen} onToggle={handleFoundationToggle}>
            <summary className="sidebar-opener">
              Foundation
    
              <ChevronIcon isOpen={isFoundationOpen} size={22} />
             
            </summary>
            <ul className="">
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
          <details open={isComponentOpen} onToggle={handleComponentToggle}>
            <summary className="sidebar-opener">
              Component
              
              <ChevronIcon isOpen={isFoundationOpen} size={22} />
            </summary>
            <ul className="">
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
            className=""
          >
            <span>Roadmap</span>
            <span className="text-xs">↗</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}