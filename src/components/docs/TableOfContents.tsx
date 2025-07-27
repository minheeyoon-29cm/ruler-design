// src/components/docs/TableOfContents.tsx
'use client';
import { useEffect, useState } from 'react';
import '../../styles/components/table-of-contents.css';

interface TOCItem { 
  id: string; 
  text: string; 
  level: number; 
}

export default function TableOfContents() {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('h2, h3')) as HTMLHeadingElement[];
    const toc: TOCItem[] = headings.map((heading) => {
      let id = heading.id;
      if (!id) {
        const slug = (heading.textContent || '')
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
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

 // 스크롤 시 활성 항목 추적
  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.querySelector('.main-content') as HTMLElement;
      if (!mainContent) return;
      
      const headings = items.map(item => document.getElementById(item.id)).filter(Boolean);
      const scrollTop = mainContent.scrollTop;
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading) {
          const headingTop = heading.offsetTop;
          if (scrollTop + 100 >= headingTop) { // 100px 오프셋
            setActiveId(heading.id);
            break;
          }
        }
      }
    };

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, [items]);

  // 앵커 클릭 시 오프셋 스크롤
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    const mainContent = document.querySelector('.main-content') as HTMLElement;
    
    if (element && mainContent) {
      const yOffset = -80; // 약간의 여유분
      const elementTop = element.offsetTop;
      const scrollTop = elementTop + yOffset;
      
      mainContent.scrollTo({ 
        top: scrollTop, 
        behavior: 'smooth' 
      });
    }
  };

  if (!items.length) return null;

  return (
    <aside className="toc-container">
      <h4 className="toc-title">On this page</h4>
      <ul className="toc-list">
        {items.map((item) => (
          <li 
            key={item.id} 
            className={`toc-item ${item.level === 3 ? 'toc-item-sub' : ''} ${activeId === item.id ? 'toc-item-active' : ''}`}
          >
            <a 
              href={`#${item.id}`} 
              className="toc-link"
              onClick={(e) => handleAnchorClick(e, item.id)}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}