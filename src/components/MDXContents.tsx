// src/components/MDXContent.tsx
'use client';

import { useMDXComponent } from 'next-contentlayer/hooks';
import { PropsWithChildren } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MDXProps {
  code: string;
}

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

  img: ({ src, alt, ...props }: any) => {
    if (!src) return null;

    const isExternal = src.startsWith('http');

    // 외부 이미지: hydration mismatch 방지를 위해 일반 <img> 사용
    if (isExternal) {
      return (
        <div className="my-6">
          <img
            src={src}
            alt={alt || ''}
            loading="lazy"
            className="rounded-md"
            {...props}
          />
        </div>
      );
    }

    // 내부 이미지: Next.js Image 사용
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

  TokenColor: ({ name }: { name: string }) => {
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
    return (
      <div className="my-2">
        <div
          style={{
            fontFamily: `var(--font-${name})`,
            fontSize: `var(--font-size-${name})`,
            fontWeight: `var(--font-weight-${name})`,
            lineHeight: `var(--line-height-${name})`,
          }}
        >
          타이포그래피 샘플 - {name}
        </div>
        <code className="text-sm">{name}</code>
      </div>
    );
  },
};

export function MDXContent({ code }: MDXProps) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
