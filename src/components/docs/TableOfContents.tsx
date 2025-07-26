// src/components/docs/TOC.tsx
'use client';
import { useEffect, useState } from 'react';

interface TOCItem { id: string; text: string; level: number; }

export default function TOC() {
  const [items, setItems] = useState<TOCItem[]>([]);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('h2, h3')) as HTMLHeadingElement[];
    const toc: TOCItem[] = headings.map((heading) => {
      let id = heading.id;
      if (!id) {
        const slug = (heading.textContent || '')
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\\s-]/g, '')
          .replace(/\\s+/g, '-');
        id = slug;
        heading.id = id;
      }
      return {
        id,
        text: heading.textContent || '',
        level: heading.tagName === 'H2' ? 2 : 3,
      };
    });
    setItems(toc);
  }, []);

  if (!items.length) return null;

  return (
    <nav className="sticky top-24 ml-4 hidden lg:block w-48 text-sm">
      <h2 className="font-semibold mb-2">On this page</h2>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
            <a href={`#${item.id}`} className="hover:text-blue-600">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
