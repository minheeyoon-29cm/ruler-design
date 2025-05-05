// src/components/MDXContent.tsx
'use client';

import { useMDXComponent } from 'next-contentlayer/hooks';
import { PropsWithChildren } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// MDX 컴포넌트 타입 정의
interface MDXProps {
  code: string;
}

// MDX에서 사용할 커스텀 컴포넌트
const components = {
  a: ({ href, ...props }: any) => {
    if (href?.startsWith('/')) {
      return <Link href={href} {...props} />;
    }
    
    if (href?.startsWith('#')) {
      return <a href={href} {...props} />;
    }
    
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
  },
  // 이미지는 Next.js Image 컴포넌트 사용
  img: ({ src, alt, ...props }: any) => {
    if (!src) return null;
    
    return (
      <div className="my-6">
        <Image 
          src={src} 
          alt={alt || ''} 
          width={800} 
          height={500} 
          className="rounded-md"
          {...props}
        />
      </div>
    );
  },
  // 나중에 확장할 수 있는 추가 컴포넌트들
  TokenColor: ({ name }: { name: string }) => {
    // 색상 토큰 시각화 컴포넌트
    return (
      <div className="flex items-center space-x-2 my-2">
        <div 
          className="w-8 h-8 rounded-md border"
          style={{ backgroundColor: `var(--color-${name})` }}
        />
        <code>{name}</code>
      </div>
    );
  },
  TokenTypography: ({ name }: { name: string }) => {
    // 타이포그래피 토큰 시각화 컴포넌트
    return (
      <div className="my-2">
        <div style={{ 
          fontFamily: `var(--font-${name})`,
          fontSize: `var(--font-size-${name})`,
          fontWeight: `var(--font-weight-${name})`,
          lineHeight: `var(--line-height-${name})`,
        }}>
          타이포그래피 샘플 - {name}
        </div>
        <code className="text-sm">{name}</code>
      </div>
    );
  },
};

// MDX 콘텐츠 렌더링 컴포넌트
export function MDXContent({ code }: MDXProps) {
  const Component = useMDXComponent(code);
  
  return <Component components={components} />;
}